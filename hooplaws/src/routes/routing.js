const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = mongoose.model('User');
const Product = mongoose.model('Product');
const Image = mongoose.model('Image');
const utils = require('../utilities/util');
var _ = require('lodash')

// Configure multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Login Route
router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ success: false, msg: "Email not found" });
      }

      const isValidPassword = utils.validPassword(req.body.password, user.hash, user.salt);

      if (isValidPassword) {
        const tokenObject = utils.issueJWT(user);
        return res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          role: user.role,
          userId: user._id
        });
      } else {
        return res.status(401).json({ success: false, msg: "Incorrect password" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

// Registration Route
router.post('/register', [
  body('email').isEmail().withMessage('Invalid email address'),

  body('password')
    .isLength({ min: 8, max: 20 }).withMessage('Password must be between 8 and 20 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/, 'g')
    .withMessage('Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character')
],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Continue with user registration if validation passes
    User.findOne({ email: req.body.email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(400).json({ success: false, msg: "Email already exists" });
        }

        // Generate a salt and hash for the provided password
        const saltHash = utils.genPassword(req.body.password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;

        // Create a new User object and save it to the database
        const newUser = new User({
          email: req.body.email,
          hash: hash,
          salt: salt,
          name: req.body.name,
          createdAt: new Date(),
          gender: req.body?.gender,
          phoneno: req.body?.phoneno,
          address: req.body?.address,
          zipcode: req.body?.zipcode,
          role: req.body.role
        });

        return newUser.save();
      })
      .then(user => {
        // Return a success message upon successful registration
        res.json({ success: true, msg: "Registration Successful" });
      })
      .catch(err => {
        // Handle unexpected errors and pass them to the error-handling middleware
        next(err);
      });
  }
);

// Add new product
router.post('/products', upload.array('images'), async (req, res, next) => {
  let imageIds = []; // To store the image IDs

  try {
    // Convert uploaded images to Base64 and store them in a separate collection
    const imageDocs = req.files.map(file => {
      return { content: file.buffer.toString('base64') };
    });

    const imageInsertResult = await mongoose.connection.collection('images').insertMany(imageDocs);

    imageIds = Object.values(imageInsertResult.insertedIds).map(id => id.toString());

    const newProduct = new Product({
      ...req.body,
      images: imageIds,
      seller: req.body.seller, // Assuming user information is available in req.user
    });

    const product = await newProduct.save();

    res.status(201).json(product);
  } catch (error) {
    // If an error occurs, delete the recently created images
    if (imageIds.length > 0) {
      await mongoose.connection.collection('images').deleteMany({ _id: { $in: imageIds } });
    }

    res.status(400).json({ error: error.message });
  }
});


// Read all products
router.get('/products', (req, res) => {
  Product.find()
    .then((products) => {
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(500).json({ err: 'Error fetching products' });
    });
});

// Route to get an image by ID
router.get('/images/:imageId', async (req, res) => {
  try {
    // Find the image by ID in the database
    const image = await Image.findById(req.params.imageId);
    if (!image) {
      return res.status(404).send('Image not found');
    }

    // Convert the Base64 string back to binary
    const imgBuffer = Buffer.from(image.content, 'base64');

    // Set the content-type and send the image
    res.type('image/jpeg').send(imgBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Read a single product by ID
router.get('/products/:id', (req, res) => {
  const productId = req.params.id;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid product ID' });
      }
      res.status(500).json({ error: 'Error fetching the product' });
    });
});

// Edit an existing product
router.put('/products/:id', (req, res) => {
  const { name, description, price, stock, category, images } = req.body;
  const productId = req.params.id;

  // Find the product by ID and update its properties
  Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      price,
      stock,
      category,
      images,
    },
    { new: true } // Return the updated product
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(updatedProduct);
    })
    .catch((err) => {
      // Handle unexpected errors and pass them to the error-handling middleware
      next(err);
    });
});

// Delete a product by ID
router.delete('/products/:id', (req, res, next) => {
  const productId = req.params.id;

  // Find the product by ID and delete it
  Product.findByIdAndDelete(productId)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // If the product has images, delete them too (assuming you have a separate Images collection)
      if (deletedProduct.images && deletedProduct.images.length > 0) {
        const imageIds = deletedProduct.images.map((imageId) => imageId.toString());

        // Delete the images associated with the product
        Image.deleteMany({ _id: { $in: imageIds } })
          .then(() => {
            // Images deleted successfully
            res.status(200).json({ message: 'Product and associated images deleted successfully' });
          })
          .catch((err) => {
            // Handle image deletion errors
            next(err);
          });
      } else {
        // No images associated with the product
        res.status(200).json({ message: 'Product deleted successfully' });
      }
    })
    .catch((err) => {
      // Handle unexpected errors and pass them to the error-handling middleware
      next(err);
    });
});

// Route to update the stock of a product by ID
router.put('/updateStock/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const newStockQuantity = req.body.stock; // Assuming the new stock quantity is sent in the request body

    // Find the product by ID and update the stock quantity
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { stock: newStockQuantity },
      { new: true } // To get the updated product document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the updated product as a response
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
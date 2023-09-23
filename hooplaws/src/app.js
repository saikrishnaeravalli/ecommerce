const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');

let envpath = './environments/.env';

if (process.env.ENVIRONMENT == 'production') {
    envpath = './environments/.env-prod'
}
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config({ path: envpath });

// Create the Express application
var app = express();
const port = process.env.PORT || 1150;

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./utilities/connection');

// Must first load the models
require('./models/index');


// Pass the global passport object into the configuration function
require('./utilities/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows our Angular application to make HTTP requests to Express application
app.use(cors());

// Where Angular builds to - In the ./angular/angular.json file, you will find this configuration
// at the property: projects.angular.architect.build.options.outputPath
// When you run `ng build`, the output will go to the ./public directory
app.use(express.static(path.join(__dirname, 'ui')));
/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use('/api', require('./routes/routing'));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'ui/index.html'))
})


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(port, () => {
    console.log(`Server listening on the port  ${port}`);
})
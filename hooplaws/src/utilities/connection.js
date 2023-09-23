const mongoose = require('mongoose');

const connectionUrl = "mongodb+srv://saikrishna:saikrishna@ecommerce.u38ogzz.mongodb.net/?retryWrites=true&w=majority";

// Connect to the correct database
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Database connected');
});

mongoose.connection.on("error", (err) => {
    logger.error("Error connecting to database  ", err);
}); 

const{ Schema } = require( "mongoose" );
const Mongoose = require( "mongoose" );
Mongoose.Promise = global.Promise;
Mongoose.set( 'useCreateIndex', true )
const url = "mongodb+srv://saikrishna:saikrishna@ecommerce.u38ogzz.mongodb.net/?retryWrites=true&w=majority";


const userSchema= Schema( {
    Username: {type: String,unique: true},
    Password: String,
    Orders: Array
},{collection: "User"} )



const productSchema = Schema( {
    _id: {type: String,unique: true},
    pName: String,
    pDescription: String,
    pRating: {type: Number,min: [0,"Rating can't be negative "]},
    pCategory: String,
    price: {type: Number,min: [0,"price can't be negative "]},
    color: String,
    image: String,
    specification: String,
    dateFirstAvailable: String,
    dateLastAvailable: String,
    pSeller: {SId: String,
        pDiscount: Number,
        pQuantity: Number,
        pShippingCharges: Number}
},{collection: "Products"
} )


let collection={};

collection.getUserCollection=()=>{
    return Mongoose.connect( url,{useNewUrlParser: true} ).then( ( database )=>{

        return database.model( 'User',userSchema )
    } ).catch( ()=>{
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}


collection.getProductCollection=()=>{
    return Mongoose.connect( url,{useNewUrlParser: true} ).then( ( database )=>{
        return database.model( 'Products',productSchema )
    } ).catch( (  )=>{
        let err = new Error( "Could not connect to Database" );
        err.status = 500;
        throw err;
    } )
}

module.exports=collection;
const express = require( 'express' )
const router = express.Router();
const create=require( '../model/dbSetup' );
const Shoppingserv=require( '../service/user' );
const User=require( '../model/Userchecking' )


router.get( '/setupdb', ( req, res, next ) => {
    create.setupDb().then( ( data ) => {
        console.log( data )
        res.send( data )
    } ).catch( ( err ) => {
        next( err )
    } )
} )

router.post( '/login', ( req,res,next ) => {
    const user=new User( req.body )
    Shoppingserv.getAllCustomerDetails( user ).then( ( custds )=>{
        res.json( custds );
    } ).catch( ( err )=>next( err ) )
  } );
router.post( '/products', ( req,res,next ) => {
    const category=req.body.category
  Shoppingserv.getAllProductsDetails( category ).then( ( prods )=>{
      res.json( prods );
  } ).catch( ( err )=>next( err ) )
} );

router.post( '/productdetails', ( req,res,next ) => {
    const orderid=req.body.orderid
  Shoppingserv.getoneProductsDetails( orderid ).then( ( prods )=>{
      res.json( prods );
  } ).catch( ( err )=>next( err ) )
} );

router.post( '/buy', ( req,res,next ) => {
    const prodid=req.body.prodid;
    const username=req.body.username
  Shoppingserv.buys( prodid,username ).then( ( prods )=>{
      res.json( prods );
  } ).catch( ( err )=>next( err ) )
} );

router.post( '/vieworders', ( req,res,next ) => {
    const username=req.body.username
  Shoppingserv.views( username ).then( ( prods )=>{
      res.json( prods );
  } ).catch( ( err )=>next( err ) )
} );

router.get( '/searchall', ( req,res,next ) => {
  Shoppingserv.search().then( ( prods )=>{
      res.json( prods );
  } ).catch( ( err )=>next( err ) )
} );
module.exports = router;


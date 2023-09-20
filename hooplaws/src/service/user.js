const db = require( '../model/user' );


let OnlineShopping={};

OnlineShopping.getAllCustomerDetails = ( user )=>{
    return  db.getUserDetails( user ).then( ( userdts )=>{
        if( userdts==null ){
            return null;
        } else{
            return userdts;
        }
    } )
}

OnlineShopping.getAllProductsDetails = ( category )=>{
    return  db.getProductsDetails( category ).then( ( proddts )=>{
        if( proddts==null ){
            let err = new Error( "No Productdetails found" );
            err.status = 404;
            throw err;
        } else{
            return proddts;
        }
    } )
}


OnlineShopping.getoneProductsDetails = ( orderid )=>{
    return  db.getonesProductsDetails( orderid ).then( ( proddts )=>{
        if( proddts==null ){
            let err = new Error( "No Productdetails found" );
            err.status = 404;
            throw err;
        } else{
            return proddts;
        }
    } )
}

OnlineShopping.buys = ( prodid,username )=>{
    return  db.buying( prodid,username ).then( ( proddts )=>{
        if( proddts==null ){
            let err = new Error( "No Productdetails found" );
            err.status = 404;
            throw err;
        } else{
            return proddts;
        }
    } )
}

OnlineShopping.views = ( username )=>{
    console.log( username )
    return  db.view( username ).then( ( proddts )=>{
        if( proddts==null ){
            let err = new Error( "No Productdetails found" );
            err.status = 404;
            throw err;
        } else{
            return proddts;
        }
    } )
}

OnlineShopping.search = ()=>{
    return  db.searching().then( ( proddts )=>{
        if( proddts==null ){
            let err = new Error( "No Productdetails found" );
            err.status = 404;
            throw err;
        } else{
            return proddts;
        }
    } )
}

module.exports=OnlineShopping;

const dbModel = require( '../utilities/connection' );

const OnlineShopdb={};

OnlineShopdb.getUserDetails = ( user )=>{
    
    return dbModel.getUserCollection().then( ( model )=>{
        return model.findOne( {Username: user.Username,Password: user.Password},{_id: 0,Username: 1} ).then( ( cusdetails )=>{
            if( !cusdetails||cusdetails.length==0||cusdetails==null ){
                return null}
            else{
                return cusdetails}
        } )
    } )
}


OnlineShopdb.getProductsDetails = ( category )=>{
    return dbModel.getProductCollection().then( ( model )=>{
        return model.find( {pCategory: category},{} ).then( ( prods )=>{
            
            if( !prods|prods.length==0 ) return null;
            else return prods;
        } )
    } )
}


OnlineShopdb.getonesProductsDetails = ( orderid )=>{
    return dbModel.getProductCollection().then( ( model )=>{
        return model.find( {_id: orderid},{} ).then( ( prods )=>{
            
            if( !prods|prods.length==0 ) return null;
            else return prods;
        } )
    } )
}

OnlineShopdb.buying = ( prodid,username )=>{
    return dbModel.getProductCollection().then( ( model )=>{
        return model.updateOne( {_id: prodid},{$inc: {"pSeller.pQuantity": -1}} ).then( ( prods )=>{
            
            if( prods.nModified==1 ){
                return model.findOne( {_id: prodid},{} ).then( ( products )=>{
                    return dbModel.getUserCollection().then( ( users )=>{
                        return users.updateOne( {Username: username},{$push: {Orders: products}} ).then( ( ord )=>{
                            if( ord.nModified==1 ){
                                return products;
                            } else{
                                return null
                            }
                        } )
                        
                    } )
                } )
            } else{return null}
        } )
    } )
}

OnlineShopdb.view = ( username )=>{
    console.log( username )
    return dbModel.getUserCollection().then( ( model )=>{
        return model.find( {Username: username},{_id: 0,Orders: 1} ).then( ( prods )=>{
            if( !prods|prods.length==0 ) return null;
            else return prods;
        } )
    } )
}

OnlineShopdb.searching = ()=>{
    return dbModel.getProductCollection().then( ( model )=>{
        return model.find( {},{} ).then( ( prods )=>{
            
            if( !prods|prods.length==0 ) return null;
            else return prods;
        } )
    } )
}
module.exports=OnlineShopdb;
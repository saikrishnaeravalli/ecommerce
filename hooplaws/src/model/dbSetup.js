const collection = require( '../utilities/connection' );

const UserDb=[{
    Username: "ram@abc.com",
    Password: "Ram@12345"
},
{
    Username: "sai@abc.com",
    Password: "Sai@12345"
},
{
  Username: "Saikrishna@abc.com",
  Password: "Saikrishna@12345"
}]


const ProductDb=
[
    {
        _id: "1001",
        pName: "Asus Zenfone Max Pro M2",
        pDescription: "an economical phone by Asus",
        pRating: 3.5,
        pCategory: "Electronics",
        price: 14999,
        color: "Black",
        image: "ZenfoneMaxProM2.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Asus@Seller",
          pDiscount: 0.2,
          pQuantity: 0,
          pShippingCharges: 150
        }
      },
      {
        _id: "1002",
        pName: "Redmi Note 6 Pro",
        pDescription: "an economical phone by Xiaomi",
        pRating: 4,
        pCategory: "Electronics",
        price: 13999,
        color: "Black",
        image: "Redminote6Pro.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Xiaomi@Seller",
          pDiscount: 0.2,
          pQuantity: 665,
          pShippingCharges: 150
        }
      },
      {
        _id: "1003",
        pName: "Moto G7 Plus",
        pDescription: "a prime phone by Moto",
        pRating: 4,
        pCategory: "Electronics",
        price: 23599,
        color: "Silver",
        image: "moto-g7.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Moto@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1004",
        pName: "Lenovo Tab 2 A8-50",
        pDescription: "a high end phone by Lenovo",
        pRating: 4.5,
        pCategory: "Electronics",
        price: 19999,
        color: "Blue",
        image: "lenovoTab.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Lenovo@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1005",
        pName: "iphone 8 plus",
        pDescription: "a high end phone by apple",
        pRating: 4.9,
        pCategory: "Electronics",
        price: 79999,
        color: "Rose Gold",
        image: "Iphone8plus.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",

        pSeller: {
          SId: "Apple@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1006",
        pName: "Adidas Running Men Lite",
        pDescription: "a pair of light weight running shoes by adidas",
        pRating: 4,
        pCategory: "Shoes",
        price: 2599,
        color: "Grey Blue",
        image: "adidas.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Adidas@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1007",
        pName: "Adidas Running Women Lite",
        pDescription: "a pair of light weight running shoes by adidas",
        pRating: 4,
        pCategory: "Shoes",
        price: 2599,
        color: "Pink",
        image: "Shoes.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Adidas@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1008",
        pName: "Adidas Running Men robust",
        pDescription: "A pair of robust running shoes by adidas",
        pRating: 4,
        pCategory: "Shoes",
        price: 3599,
        color: "Black",
        image: "adidas1.png",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Adidas@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1009",
        pName: "Reebok training shoes",
        pDescription: "A pair of light weight training shoes by Reebok",
        pRating: 3,
        pCategory: "Shoes",
        price: 1599,
        color: "Grey",
        image: "Reebok1.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Reebok@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1010",
        pName: "Nike Running Men Lite",
        pDescription: "a pair of light weight running shoes by Nike",
        pRating: 4.6,
        pCategory: "Shoes",
        price: 6599,
        color: "Green",
        image: "nike.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Nike@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1011",
        pName: "Luxury Bed by Zuari",
        pDescription: "sunmica finished zuari luxury bed",
        pRating: 4,
        pCategory: "Furniture",
        price: 8999,
        color: "Beige",
        image: "zuaribed.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Zuari@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1012",
        pName: "Organised Cupboards by Zuari",
        pDescription: "sunmica finished zuari cupboards",
        pRating: 4.3,
        pCategory: "Furniture",
        price: 6999,
        color: "Coffee Brown",
        image: "zuaricupboard.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Zuari@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1013",
        pName: "Dressing Table by Zuari",
        pDescription: "sunmica finished zuari Dressing table",
        pRating: 4,
        pCategory: "Furniture",
        price: 8599,
        color: "Beige",
        image: "swandressing.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Zuari@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1014",
        pName: "Recliner sofa set by Grihshobha",
        pDescription: "A luxurious and comfortable sofa set by Grihshobha furniture makers",
        pRating: 4.8,
        pCategory: "Furniture",
        price: 12500,
        color: "Dark grey",
        image: "reclinersofa.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Grihshobha@Seller",
          pDiscount: 0.3,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1015",
        pName: "Dining table by @HOME",
        pDescription: "Teak wood dining table with glass top",
        pRating: 4.4,
        pCategory: "Furniture",
        price: 18999,
        color: "caramel",
        image: "Dinning-Table.jpeg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "HOME@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1016",
        pName: "Kurta Plazzo set ethnic for women",
        pDescription: "embroidery work kurta plazzo set for women",
        pRating: 4,
        pCategory: "Clothing",
        price: 1499,
        color: "Orange",
        image: "womankurta.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Ethnic@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1017",
        pName: "Cotton silk saree by FabIndia",
        pDescription: "cotton silk hand woven sarees by Fabindia",
        pRating: 4.8,
        pCategory: "Clothing",
        price: 5900,
        color: "Red",
        image: "Saree.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "FabIndia@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1018",
        pName: "Virat's Special for men ethnic",
        pDescription: "Festive season special woven black woollen coat for men",
        pRating: 4.8,
        pCategory: "Clothing",
        price: 1900,
        color: "black",
        image: "Menethnic.jpeg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "Ethnic@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1019",
        pName: "US Polo T-shirt",
        pDescription: "100 % pure cotton t shirt by US polo",
        pRating: 4.8,
        pCategory: "Clothing",
        price: 3299,
        color: "Orange",
        image: "USP.jpeg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "USPolo@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      },
      {
        _id: "1020",
        pName: "UCB T-shirt",
        pDescription: "100 % pure cotton t shirt by UCB",
        pRating: 4.2,
        pCategory: "Clothing",
        price: 1900,
        color: "Blue",
        image: "UCB.jpg",
        specification: "",
        dateFirstAvailable: "2012-09-17T00:00:00.000Z",
        dateLastAvailable: "2017-09-17T00:00:00.000Z",
        pSeller: {
          SId: "UCB@Seller",
          pDiscount: 0.2,
          pQuantity: 666,
          pShippingCharges: 150
        }
      }
]


exports.setupDb = () => {
    return collection.getUserCollection().then( ( customer ) => {
        return customer.deleteMany().then( () => {
            return customer.insertMany( UserDb ).then( () => {
                return collection.getProductCollection().then( ( booking ) => {
                    return booking.deleteMany().then( () => {
                        return booking.insertMany( ProductDb ).then( ( data ) => {
                            if( data ) return"Insertion Successfull"
                            else{
                                let err = new Error( "Insertion failed" );
                                err.status = 400;
                                throw err;
                            }
                        } )
                    } )
                } )
            } )
        } )
    } )
}
const validators=require( '../src/utilities/validator' );

describe( "test validators",()=>{
   it( 'testing Username with correct input',
   ()=>{
       Username="sai@abc.com";
       expect( validators.Username( Username ) ).toEqual( Username );
   } );
   
   it( 'testing password with correct input',
   ()=>{
       Password="Sai@12345";
       expect( validators.Password( Password ) ).toEqual( Password );
   } )

   it( 'testing Username with wrong input',
   ()=>{
       Username="sai@abc";
       expect( ()=>{validators.Username( Username )} ).toThrow( new Error( "Username format is wrong" ) )
   } )
   } );


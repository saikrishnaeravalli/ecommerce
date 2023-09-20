let validator={}

validator.Username=( Username )=>{
    if( Username.match( /^[A-z]+@abc.com$/ ) ){
        return Username;
    }
    else{
        let err=new Error( "Username format is wrong" )
        err.status=406
        throw err
    }
}

validator.Password=( Password )=>{
    if( Password.match( /^(?=.*[A-Z])(?=.*[!@#$%&*])(?=.*[a-z]).{7,20}$/ ) ){
        return Password;
    }
    else{
        let err=new Error( "Password format is wrong" )
        err.status=406
        throw err
    }
}
module.exports=validator;
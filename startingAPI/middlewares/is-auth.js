const jwt= require('jsonwebtoken')

module.exports= (req,res,next)=>{
    const token= req.get('Authorization')?.split(' ')[1]
    let decodedToken;
    try{
        decodedToken= jwt.verify(token, 'supermotherofjesussecret')
    }catch(error){
        error.statusCode= 500
        throw error
    }

    if(!decodedToken){
        const error= new Error("Not authenticaded")
        error.statusCode= 401
        throw error
    }

    req.userId= decodedToken.userId
    next()
}
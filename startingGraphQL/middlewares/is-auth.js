const jwt= require('jsonwebtoken')

module.exports= (req,res,next)=>{
    const authHeader= req.get('Authorization')

    if(!authHeader){
        req.isAuth= false
        next()
    }

    const token= req.get('Authorization')?.split(' ')[1]
    let decodedToken;
    try{
        decodedToken= jwt.verify(token, 'supersecrettoken')
    }catch(error){
        req.isAuth= false
        next()
    }

    if(!decodedToken){
        req.isAuth= false
        next()
    }

    req.userId= decodedToken.userId
    req.isAuth= true
    next()
}
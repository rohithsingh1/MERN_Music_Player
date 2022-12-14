const jwt=require("jsonwebtoken");

module.exports=(req,res,next) => {
    try {
        const jwtToken=req.headers.authorization.split(" ")[1];
        if(!jwtToken) {
            return res.status(401).send({
                message: 'Token not found or expired',
                success: false,
                data: null,
                token : null
            })
        }
        const decoded=jwt.verify(jwtToken,process.env.JWT_KEY)
        req.body.userId=decoded.userId;
        req.body.userDetails=decoded;
        req.body.jwtToken = jwtToken
        next()
        
    } catch (error) {
         return res.status(401).send({
                message: 'Authorization Failed',
                success: false,
                data: null,
                token : null
            })
    }
}


















const jwt = require("jsonwebtoken") ;

const otpMiddleware = async (req, res, next) => {

    try {
    let token ;
    
    if (req.headers["authorization"] && req.headers["authorization"].startsWith("Bearer ")) {
      token = req.headers["authorization"].split(" ")[1];
    } 
    else{
        return res.status(401).json({ message: 'token required' });
        
    }
      const decoded =  jwt.verify(token,process.env.OTPSECRET);
      if(!decoded){
       return res.status(400).json({ message: 'Unauthorized: Invalid token' });
        }
        req.otp = decoded; 
    next();
    } catch (err) {
      console.log(err.message)
      res.status(403).json({success:false, message:err.message  });
    }
  };
  module.exports = otpMiddleware
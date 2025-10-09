const jwt = require("jsonwebtoken") ;
const venderModel = require("../models/venderModel");
// const { nanoid } = require("nanoid");


const authMiddleware = async (req, res, next) => {
// console.log("sdc")
  try {
  let token ;
  // console.log('fd')
  if (req.headers["authorization"] && req.headers["authorization"].startsWith("Bearer ")) {
    token = req.headers["authorization"].split(" ")[1];
  } 
   else{
     return res.status(401).json({ message: 'token required' });
      
      }
    const decoded =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(!decoded){
      return res.status(400).json({ message: 'Unauthorized: Invalid token' });
 
       }
    if(decoded?.role == 'vendor'){
      const vender = await venderModel.findById({_id : decoded._id})
  
      if (!vender || vender?.token !== token) {
        return res.status(401).json({ message: "Session expired. Please log in again." });
    }
      req.vendor = vender; 
    }
    req.vendor = decoded
   
    next();
  } catch (err) {
    // console.log("sdc")
    console.log(err.message)
    res.status(403).json({success:false, message:err.message  });
  }
};
   

module.exports =  authMiddleware ;


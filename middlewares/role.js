const authorize = (roles) => (req, res, next) => {

    if (!roles.includes(req.vendor.role)) {
      return res.status(403).send({ error: 'Access denied' });
    }
    // console.log("req",req.vendor.role)
    
    next();
  };


  module.exports = authorize
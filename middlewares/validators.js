// const { BadRequestResponse } = require('../helpers/http.js');
// const vendorSchema = require('../vendor/vendorSchema.js');


const validator = (schema) => (req, res, next) => {
    const result =  schema.validate(req.body); 
          if (!result.error) 
            {
              // console.log("sdfsd")
                return next();
            }
   else {
         const { details } = result.error;
               const message = details
                 .map((i) => i.message.replace(/['"]+/g, ""))
                 .join(",");
            
        return  res.status(400).send({
                success: false,
                message :message,
             
              });
          
    }
}

module.exports ={ validator }
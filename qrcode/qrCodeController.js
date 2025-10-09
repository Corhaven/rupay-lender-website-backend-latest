// const shopModel = require("../models/shopModel");

// const createShop = async(req,res)=>{

    
//         const { name, address, managerCode } = req.body;
//         const shop = new Shop({ name, address, managerCode });
//         try {
//             await shop.save();
//             res.send({ shopId: shop._id });
//         } catch (err) {
//             res.status(500).send('Error creating shop');
//         }
    
// }
// module.exports = createShop
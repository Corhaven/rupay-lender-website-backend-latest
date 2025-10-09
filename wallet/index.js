const express = require('express');
const { Cashfree } = require("cashfree-pg"); 
  const dotenv = require("dotenv")
dotenv.config()
const walletRouter = express.Router()

walletRouter.post('/create-order', async (req, res) => {
    const { customer_id, customer_phone, order_id, order_currency, order_amount } = req.body;
  
    Cashfree.XClientId = process.env.CASHFREE_PAYMENT_X_CLIENT;
    Cashfree.XClientSecret = process.env.CASHFREE_PAYMENT_CLIENT_SECRET;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
   
    var request = {
      order_id: order_id || "12340",
          order_currency: order_currency || 'INR',
          order_amount: order_amount || 1,       
        "customer_details": {
          customer_id: customer_id || '12AAA812234', 
            customer_phone: customer_phone || '9898989898'
        },
        "order_meta": {
            "return_url": `https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id=${order_id}`,
              // "payment_methods": "cc,dc,upi"
        }
    };    
    Cashfree.PGCreateOrder("2023-08-01", request).then((response) => {
        // console.log('Order created successfully:',response.data);
        res.status(200).send(response.data);
    }).catch((error) => {
        console.error('Error:', error.response.data.message);
        res.status(500).json({
              message: 'Failed to create order',
              error: error.response ? error.response.data : error.message
            });
    });
    
  });
walletRouter.post("/order-status",(req,res)=>{
try {
  

  const {orderId} = req.body
  // console.log(orderId)
  Cashfree.XClientId = process.env.CASHFREE_PAYMENT_X_CLIENT;
  Cashfree.XClientSecret = process.env.CASHFREE_PAYMENT_CLIENT_SECRET;
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
  
  Cashfree.PGOrderFetchPayments("2025-01-01", orderId).then((response) => {
    // console.log('Order fetched successfully:', response?.data);
    // console.log( response?.data)
  
    const resp = response?.data
    res.status(200).send({success:true,resp})

  
  }).catch((error) => {
    console.error('Error:', error?.message);
  })

} catch (error) {
  console.log(error.message)
}
})
  module.exports = walletRouter
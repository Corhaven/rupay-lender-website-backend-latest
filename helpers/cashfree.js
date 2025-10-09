// // services/cashfree.js
// const axios = require('axios');
const { Cashfree } =require("cashfree-pg") ; 
const dotenv = require("dotenv")
dotenv.config()
// // Initiate payment (dummy example)
// const initiateCashfreePayment = async (amount) => {
//     // Cashfree API integration goes here
//     // This is just a placeholder function for your Cashfree API integration
//     return `https://test.cashfree.com/paymentLink/${amount}`;
// };

// // Verify payment (dummy example)
// const verifyCashfreePayment = async (transactionId) => {
//     // Cashfree API call to verify the payment
//     return { status: 'success' }; // Mocking successful payment verification
// };
// import { Cashfree } from "cashfree-pg"; 

Cashfree.XClientId = process.env.CASHFREE_PAYMENT_X_CLIENT
Cashfree.XClientSecret =process.env.CASHFREE_PAYMENT_CLIENT_SECRET
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

// module.exports = { initiateCashfreePayment, verifyCashfreePayment };

const initiateCashfreePayment = async (amount, orderId, customerId, customerPhone) => {
    try {
          const request = {
            order_amount: amount,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: customerId,
                customer_phone: customerPhone,
            },
            order_meta: {
                return_url: `https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}`,
            },
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        // console.log(response)
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};
module.exports = { initiateCashfreePayment };

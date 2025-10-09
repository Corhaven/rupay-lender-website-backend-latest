// const express = require("express")
// const whatsuppRouter = express.Router()
// var axios = require('axios');



// const sendWhatsMessage = async(id, mobile)=>{
// console.log("e",id, mobile)
//     var data = JSON.stringify({
//         "userId": id,
//         "fullPhoneNumber": mobile,
//         "callbackData": "some_callback_data",
//         "type": "Text",
//         "data": {
//             "message": "This msg is sent via API"
//         }
//     });
    
//     var config = {
//   method: 'post',
// maxBodyLength: Infinity,
//   url: 'https://api.interakt.ai/v1/public/message/',
//   headers: { 
//     'Authorization': 'Basic VjN2UmpENXJvencwbGVpSmNuOGFYc2R6aTB2ZWpKYU5jcE1vQkhTd3FYczo=', 
//     'Content-Type': 'application/json'
// },
// data : data
// };

// axios(config)
// .then(function (response) {

//     console.log(JSON.stringify(response?.data));
// })
// .catch(function (error) {
//     console.log(error);
// });
// }
// const triggerEvent = async(id,mobile)=>{

//     var data = JSON.stringify({
//         "userId": id,
//         "event": "Sign Up Event",
//         //   "traits": {
//             //     "productName": "Shoes",
//             //     "quantity": 2,
//             //     "price": 500,
//             //     "currency": "INR"
//             //   }
//         });
        
//         var config = {
//             method: 'post',
//             maxBodyLength: Infinity,
//             url: 'https://api.interakt.ai/v1/public/track/events/',
//             headers: { 
//                 'Content-Type': 'application/json', 
//                 'Authorization': 'Basic VjN2UmpENXJvencwbGVpSmNuOGFYc2R6aTB2ZWpKYU5jcE1vQkhTd3FYczo='
//             },
//             data : data
//         };
        
//         axios(config)
//         .then(function (response) {
//             console.log(JSON.stringify(response.data));
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
//     }

//     const createUser =async(data)=>{
//         var axios = require('axios');


// var config = {
//   method: 'post',
// maxBodyLength: Infinity,
//   url: 'https://api.interakt.ai/v1/public/track/users/',
//   headers: { 
//     'Content-Type': 'application/json', 
//     'Authorization': 'Basic VjN2UmpENXJvencwbGVpSmNuOGFYc2R6aTB2ZWpKYU5jcE1vQkhTd3FYczo='
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//     console.log(JSON.stringify(response.data));
//      triggerEvent(data?.userId)
//     //  sendWhatsMessage(data?.userId,data?.fullPhoneNumber)
// })
// .catch(function (error) {
//   console.log(error);
// });
//     }
// module.exports = {sendWhatsMessage,triggerEvent,createUser}

// // whatsuppRouter.post("/send",send)
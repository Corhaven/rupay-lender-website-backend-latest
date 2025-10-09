

const express = require("express");
const { submitController ,getCibilDataController} = require("./Controller");
const jwt = require('jsonwebtoken');
// const sprintverify = require('@api/sprintverify');
// const sprintverify = require('../../api/sprintverify');
const axios = require('axios');

const cibilRouter = express.Router();

cibilRouter.post("/form-submit",submitController)
cibilRouter.get("/cibil-data",getCibilDataController)
cibilRouter.get("/credit-score", async (req, res) => {
  try {


   const SECRET_KEY = "UTA5U1VEQXdNREF4VFZSSmVrNUVWVEpPZWxVd1RuYzlQUT09";
     const AUTHORISED_KEY = "TVRJek5EVTJOelUwTnpKRFQxSlFNREF3TURFPQ==";
     const PARTNER_ID = "CORP00001";
     
     // 🔹 Generate JWT Token
     function generateJwtToken() {
       const currentTimestamp = Math.floor(Date.now() / 1000); // epoch timestamp
       const randomNumber = Math.floor(Math.random() * 9999999) + 1; // unique request ID
     
       const payload = {
         timestamp: currentTimestamp,
         partnerId: PARTNER_ID,
         reqid: randomNumber,
       };
     
       return jwt.sign(payload, SECRET_KEY, { algorithm: "HS256" });
     }
     const token = generateJwtToken();
const options = {
  method: 'POST',
  url: 'https://uat.paysprint.in/sprintverify-uat/api/v1/verification/credit_report_checker',
  headers: {
    accept: 'application/json',
    Token: token,
    authorisedkey: 'TVRJek5EVTJOelUwTnpKRFQxSlFNREF3TURFPQ==',
    'content-type': 'application/json'
  },
  data: {
    refid: '5436456',
    name: 'Manish Gupta',
    mobile: '8889998889',
    document_id: 'QWERT1234Y',
    date_of_birth: '2001-01-12',
    address: 'address',
    pincode: '110011'
  }
};

axios
  .request(options)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
    res.status(200).send({ success: true, message: "Credit score fetched successfully" });
  } catch (error) { 
    console.error("Error fetching credit score:", error);
    res.status(500).send({ success: false, message: "Failed to fetch credit score" });
  }})
module.exports = cibilRouter
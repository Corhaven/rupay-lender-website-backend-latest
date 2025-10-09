const CibilUser = require("../models/CibilUser");
const axios = require('axios');
const jwt = require('jsonwebtoken');
const submitController  = async(req,res)=>{
     const {
    firstName,
    lastName,
    email,
    dob,
    mobile,
    pan,
    // agreePolicy,
  } = req.body;
  if (
    !firstName ||  !lastName ||
    !email ||
    !dob ||
    !mobile ||
    !pan 
  ) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }
   try {
    // Check for existing entry
  
    const existingUser = await CibilUser.findOne({ pan, mobile });

    if (existingUser) {
      return res.status(200).json({ message: "User with this PAN and Phone Number already exists. Not saved." });
    }
else{
   const newUser = new CibilUser({
      firstName,
      lastName,
      email,
      dob,
      mobile,
      pan,
    });

    await newUser.save();

    res.status(201).json({ message: "CIBIL form submitted successfully!" });
}
    // Save new user
 
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ message: "Server error. Try again later." });
  }
}

const getCibilDataController = async (req, res) => {
  try {
    const cibilData = await CibilUser.find();
    res.status(200).send({success:true,message:"cibil data fetch",cibilData});
  } catch (err) {
    console.error("Error fetching CIBIL data:", err);
    res.status(500).json({ message: "Server error. Try again later." });
  } 
}
module.exports = {submitController,getCibilDataController}
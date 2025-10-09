const { default: axios } = require("axios")

       
const pinCode = async(req,res)=>{
    try {
        const {pinCode} = req.body
        // console.log(pinCode)
        const {data} = await axios.get(`https://api.postalpincode.in/pincode/${pinCode}`)
    //    console.log(data[0]?.PostOffice[0])


       res.status(200).send({success : true,info:data[0]?.PostOffice[0]})

    } catch (error) {
        res.status(500).send({success : false,message: error.message})
    }
    
}
module.exports =pinCode
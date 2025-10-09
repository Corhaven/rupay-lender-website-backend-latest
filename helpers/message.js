const { default: axios } = require('axios');
var qs = require('qs');

const sendSms = async(message,mobile)=>{
    mobile = `+91${mobile}`
// console.log("ewdfe",message,mobile,process.env.SENDERID,process.env.API_KEY_2fa)
    // console.log()
    var data = qs.stringify({
        'module': 'TRANS_SMS',
        'apikey': process.env.API_KEY_2fa,
        'to':mobile,
        'from': process.env.SENDERID,
        'msg':message
    });
    var config = {
        method: 'post',
        maxBodyLength: Infinity,
    url: 'https://2factor.in/API/R1/',
    headers: { },
    data : data
};

await axios(config)
.then(function (response) {

    return response?.data
})
.catch(function (error) {
    console.log(error);
    return error.message
});
}
module.exports = {sendSms}


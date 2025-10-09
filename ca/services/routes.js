const express = require("express")
// const uploadB2bLeads = require("../../helpers/multer")
const authMiddleware = require("../../middlewares/authmiddleware")
const { tradeMark, msme, duplicatePanCard, correctionPan, panCardregistration, gstReturn, gstRegister, businessRegistration, foodLicenseController, dsc, taxationregistrtion } = require("./controllers")
const { uploadB2bLeads } = require("../../helpers/multervendor")
// const msmeModel = require("../../models/msmeModel");

const trademarkRouter = express.Router()
const panCardRouter = express.Router()
const businessRegistrationRouter = express.Router()
const msmeRouter = express.Router()


//////////////////dsc/////////////////
const dscRouter = express.Router()

const dscImg = uploadB2bLeads.fields([
    { name: 'proofOfIdentity', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 },
    { name: 'attestationOfficerProof', maxCount: 1 },
   
  
  ])
  dscRouter.post('/dsc',dscImg,authMiddleware,dsc)


////////////food registration///////////////


const foodLicenseRouter = express.Router()
const foodLicenseImg = uploadB2bLeads.fields([
  { name: 'photoId', maxCount: 1 },
  { name: 'businessAddressProof', maxCount: 1 },
  { name: 'businessPremisesProof', maxCount: 1 },
  { name: 'businessConstitution', maxCount: 1 },
  { name: 'foodSafetyPlan', maxCount: 1 },
  { name: 'foodProductList', maxCount: 1 },
  { name: 'bankAccountInformation', maxCount: 1 },


])
foodLicenseRouter.post('/registration',foodLicenseImg,authMiddleware,foodLicenseController)
//////////////////////////////////////////////////////////////////////////////////////////////

// company resgistration


const businessDocsImg = uploadB2bLeads.fields([
    { name: 'addressProof', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'aadhaarCard', maxCount: 1 },
    { name: 'digitalSignatureCertificate', maxCount: 1 },
    { name: 'directorIdentificationNumber', maxCount: 1 },
    { name: 'registeredOfficeProof', maxCount: 1 },
    { name: 'declaration', maxCount: 1 },
    { name: 'memorandumOfAssociation', maxCount: 1 },
    { name: 'articlesOfAssociation', maxCount: 1 },
  
  ])
  businessRegistrationRouter.post('/registration',businessDocsImg,authMiddleware,businessRegistration)
///////////////////////////////////////////////////////////////////////////////////////////////////

  // msme Router/////////////////////////////////////////////////////////

  const Img5 = uploadB2bLeads.fields([
      { name: 'panCard', maxCount: 1 },
      { name: 'aadhaarCard', maxCount: 1 },
  
    ])
    msmeRouter.post('/msme',Img5,authMiddleware,msme)
////////////////////////////////////////////////////////////////////////////////////////////////////////

// gst Router//////////////////////////////////////////////////////////////
const gstRouter = express.Router()
const gstDocsImg = uploadB2bLeads.fields([
    { name: 'panCard', maxCount: 1 },
    { name: 'businessRegistration', maxCount: 1 },
    { name: 'identity', maxCount: 1 },
    { name: 'pic', maxCount: 1 },
    { name: 'bankAccountStatement', maxCount: 1 },
    { name: 'addressProofofBusiness', maxCount: 1 },
    { name: 'addressProofofPerson', maxCount: 1 },
  
  ])

gstRouter.post('/gst-registration',gstDocsImg,authMiddleware,gstRegister)
gstRouter.post("/gst-return",authMiddleware,gstReturn)

// trademark/////////////////////////////////////////////////////////////
const Img = uploadB2bLeads.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'certificateOfRegistration', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'logo', maxCount: 1 },

])
  trademarkRouter.post('/trademark',Img,authMiddleware,tradeMark)

  ///pancard//////////////////////////////////////////////////////////////
  const Img4 = uploadB2bLeads.fields([
   
    { name: 'proofOfBirth', maxCount: 1 },
    { name: 'proofOfAddress', maxCount: 1 },
    { name: 'proofOfIdentity', maxCount: 1 },
    // { name: 'proofofIdentity', maxCount: 1 },
    // { name: 'proofOfAddress', maxCount: 1 },
    { name: 'certificateOfRegistration', maxCount: 1 },
  ]
)
const Img2 = uploadB2bLeads.fields([
    
  { name: 'identityProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'ageProof', maxCount: 1 },
  { name: 'previouslyIssuedPAN', maxCount: 1 },
])
const Img3 = uploadB2bLeads.fields([
   
  { name: 'proofOfBirth', maxCount: 1 },
  { name: 'proofofIdentity', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 },
  { name: 'proofOfPan', maxCount: 1 },


])  

  panCardRouter.post('/duplicate-pan-registration',Img2,authMiddleware,duplicatePanCard)
  panCardRouter.post("/pan-correction",Img3,authMiddleware,correctionPan)
  panCardRouter.post('/pan-registration',Img4,authMiddleware,panCardregistration)

  /////////////////////////////
///////////////////accounting taxation /////////////

const accountingTaxationRouter = express.Router()

accountingTaxationRouter.post('/accounting-taxation',authMiddleware,taxationregistrtion)
/////////////////////////////////////////////////////
// module.exports = accountingTaxationRouter
module.exports = {businessRegistrationRouter,trademarkRouter,msmeRouter,panCardRouter,gstRouter,foodLicenseRouter,dscRouter,accountingTaxationRouter}
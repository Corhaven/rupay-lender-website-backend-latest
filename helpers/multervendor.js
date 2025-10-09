
const multerS3 = require('multer-s3');
const multer = require("multer")
const { S3Client } = require('@aws-sdk/client-s3');
const dotenv = require("dotenv")
dotenv.config()
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})


const s3Storage2 = multerS3({
  s3: s3,
  bucket: "rupay-lender-vendor-signup", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const upload2 = multer({storage : s3Storage2,limits: { fileSize: 1024 * 1024 * 100 },})


const s3Storage3 = multerS3({
  s3: s3,
  bucket: "rupay-lender-telecaller-signup", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const uploadtelecaller = multer({storage : s3Storage3,limits: { fileSize: 1024 * 1024 * 100 },})

const s3Storage4 = multerS3({
  s3: s3,
  bucket: "rupay-lender-banker-info", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const uploadBankerInfo = multer({storage : s3Storage4,limits: { fileSize: 1024 * 1024 * 100 },})


const s3Storage5 = multerS3({
  s3: s3,
  bucket: "rupay-lender-b2b-leads", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const uploadB2bLeads = multer({storage : s3Storage5,limits: { fileSize: 1024 * 1024 * 100 },})


const s3Storage6 = multerS3({
  s3: s3,
  bucket: "rupay-lender-cibil", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const uploadcibil = multer({storage : s3Storage6,limits: { fileSize: 1024 * 1024 * 100 },})

const s3Storage7 = multerS3({
  s3: s3,
  bucket: "rupay-lender-event", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const uploadEvent = multer({storage : s3Storage7,limits: { fileSize: 1024 * 1024 * 100 },})

const s3Storage8 = multerS3({
  s3: s3,
  bucket: "rupay-lender-blog", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const uploadBlog = multer({storage : s3Storage8,limits: { fileSize: 1024 * 1024 * 100 },})

const s3Storage9 = multerS3({
  s3: s3,
  bucket: "rupay-lender-franchise-and-distributor", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const uploadFranchiseAndDistributor = multer({storage : s3Storage9,limits: { fileSize: 1024 * 1024 * 100 },})




module.exports = {uploadFranchiseAndDistributor,upload2,uploadtelecaller,uploadBankerInfo,uploadB2bLeads,uploadcibil,uploadEvent,uploadBlog}
// module.exports = {s3}
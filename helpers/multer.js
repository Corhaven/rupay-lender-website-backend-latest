
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

const s3Storage = multerS3({
  s3: s3,
  bucket: "rupay-lender-web-bucket", // change it as per your project requirement
  acl: "public-read", // storage access type
  metadata: (req, file, cb) => {
      cb(null, {fieldname: file.fieldname})
  },
  key: (req, file, cb) => {
      const fileName = `/${file.fieldname}_${Date.now()}_${file.originalname}`;
      cb(null, fileName);
  },
});
const upload = multer({storage : s3Storage,limits: { fileSize: 1024 * 1024 * 100 },})


module.exports = upload

const dotenv = require("dotenv")
const express = require("express")
const connect = require("./db.js")
const cors = require("cors")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const venderRouter = require("./vendor/venderRoutes.js")
const loanRouter = require("./loans")
const authRouter = require("./auth/authRoutes.js")
const adminRouter = require("./admin/index.js")
const { socketInit } = require("./helpers/socket.js")
const subAdminRouter = require("./subAdmin/index.js")

// const gstRouter = require("./ca/gst/gstRoutes.js")
// const caRouter = require("./ca/index.js")
// const businessRegistrationRouter = require("./ca/businessregitsration/businessRegistrationRoutes.js")
const webdevRouter = require("./webdev/webDevRoutes.js")
const socialMediaRouter = require("./socialMedia/socialMediaRoutes.js")
const cardRouter = require("./card/cardRoutes.js")

const graphicDesignRouter = require("./graphicdesign/graphicDesignRoutes.js")
const { b2cRouter } = require("./b2c/index.js")
const walletRouter = require("./wallet/index.js")
const path = require('path');
const cibilRouter  = require("./cibil/index.js")
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const os = require("os")
const xss = require('xss-clean');
const cluster = require('cluster');
const motorInsuranceRouter = require("./motorInsurance/motorInsuranceRoutes.js")
const companyModel = require("./models/companyModel.js")
const carrierRouter = require("./carrier/index.js")
const { bankerRouter } = require("./bankers/index.js")

const compression = require('compression');
const promBundle = require('express-prom-bundle');
const { subVendorRouter } = require("./subvendor/index.js")
const caRouter = require("./ca/index.js")
const otherServiceRouter = require("./otherService/index.js")
const dayjs = require("dayjs")


// const app = express();

// Enable Gzip Compression

dotenv.config()
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  
const app = express()
connect()
app.disable('etag'); 
app.set('trust proxy', 1);
app.use(helmet());
app.use(helmet.xssFilter()); 
app.disable('x-powered-by');

app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  res.removeHeader("Strict-Transport-Security");
  res.removeHeader("X-Frame-Options");
  res.removeHeader("X-Content-Type-Options");
  res.removeHeader("X-XSS-Protection");
  res.removeHeader("Referrer-Policy");
  res.removeHeader("Permissions-Policy");
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Resource-Policy");
  next();
}); 
app.use(xss());
const metricsMiddleware = promBundle({ includeMethod: true });

app.use(metricsMiddleware);




app.use('/robots.txt', (req, res) => {
  // console.log(path.join(__dirname, 'public', 'robots.txt'))
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});
///// middleware

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, 
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true }));

   const allowedOrigins = [
    'https://x.clarity.ms',
     "https://rupaylender.com",
    'https://api.rupaylender.com',
    'https://api.cashfree.com',
    'https://sales.rupaylender.com',
    'https://adminweb.rupaylender.com',
    'https://www.rupaylender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'https://team.rupaylender.com',    
    'https://check.rupaylender.com'
  ];
                                               
app.use((req, res, next) => {
  const origin = req.headers?.origin;    
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); 
  // Handle Preflight (OPTIONS) Requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const corsOptions = { 
  origin: [ "https://x.clarity.ms/collect", "https://rupaylender.com","https://api.cashfree.com",
    "https://adminweb.rupaylender.com","https://api.rupaylender.com",
    "https://www.rupaylender.com","http://localhost:5175","http://localhost:3000",
    "http://localhost:5174","https://team.rupaylender.com","http://localhost:5173",
    "http://localhost:5176","https://sales.rupaylender.com", "https://check.rupaylender.com"],
  credentials: true, 
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
};
app.use(cors(corsOptions));
// CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH,OPTIONS,HEAD");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Credentials", "true");


  next();
});



  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      // "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self';"
      "default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.rupaylender.com;"

    );
    // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    // res.setHeader('X-Frame-Options', 'DENY');
    // res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
     

    next();
  });

  const corsOptions2 = { 
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
 
  app.use(cors(corsOptions2));
  app.use(compression());
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });
  app.use(cookieParser());
  app.use(morgan("dev"));
 ////////////// routes 
//  app.use("/b2c",b2cRouter)
app.use("/api",venderRouter)
app.use("/auth",authRouter)
app.use("/loans",loanRouter)
// app.use("/gst",gstRouter)
app.use("/admin",adminRouter)
app.use("/subAdmin",subAdminRouter)
app.use("/ca",caRouter)
// app.use("/registration",businessRegistrationRouter)
app.use("/web",webdevRouter)
app.use("/social",socialMediaRouter)
app.use("/card",cardRouter)
app.use("/graphic-design",graphicDesignRouter)
app.use("/inquiry",b2cRouter)
app.use("/wallet",walletRouter)
app.use('/motor-insurance',motorInsuranceRouter)
app.use('/carrier',carrierRouter)
app.use('/banker',bankerRouter)
app.use("/other-service",otherServiceRouter)
app.use("/sub-vendor",subVendorRouter)

app.use("/cibil",cibilRouter)

//////////////////////// 
// const upload = multer({ dest: 'uploads/' });
// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   try {    
//     const workbook =  XLSX.readFile(req.file.path);
 
//     const sheet_name_list = workbook.SheetNames;
  
//     const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: '' });
   
//     const mappedData = jsonData.map(row => {
//       let date = new Date(row['Date']);
//       if (isNaN(date.getTime())) {
//         date = null;  
//       }

//       return {
//         cinNumber: row['CIN Number'],
//         companyName: row['Company Name'],
//         companyCategory: row['Company Category'],
//         Date: date, // use the parsed or null date here
//         remarks: row['Remarks']
//       };
//     });
  
//     await companyModel.insertMany(mappedData);
//     res.status(200).send('Data inserted successfully');
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     res.status(500).send('Error inserting data');
//   }
// });
// Route to handle Excel file upload and data insertion

////////////////////
app.get('/search-company', async (req, res) => {
  const searchTerm = req.query.name;
  try {
    const companies = await companyModel.find({
      companyName: { $regex: searchTerm, $options: 'i' }
    }).limit(10).lean(); // Use .limit() and .lean() for faster performance

    // res.json(companies.map(company => company.companyName));
   const companyList= companies.map(company => company.companyName)
    res.status(200).send({success : true, message : "Company fetch",companyList})
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).send('Error fetching companies');
  }
});
const port = process.env.PORT
app.listen(port,'0.0.0.0',()=>{
    console.log("app is working",port)
})
}

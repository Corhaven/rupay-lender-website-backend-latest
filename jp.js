// const fs = require('fs');

const { default: mongoose } = require("mongoose");
const subAdminModel = require("./models/subAdminModel");

// // Base64 encoded string (this is the photo_link value from your data)
const base64String = "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/..."; // Truncated for brevity

// Decode the base64 string
const buffer = Buffer.from(base64String, 'base64');

// Write the binary data to a file (jpeg image)
fs.writeFile('output_image.jpeg', buffer, (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('File saved as output_image.jpeg',buffer);
    }
});
// const checkIndexes = async () => {
//     try {
//     //   await mongoose.connection; // Ensure the connection is ready
  
//       // List all indexes on the 'subAdmin' collection
//       const indexes = await subAdminModel.collection.dropIndexes()
//       console.log("Indexes on subAdmin collection:", indexes);
//     } catch (error) {
//       console.error("Error fetching indexes:", error.message);
//     } 
//   };
  
//   // Call the function to check indexes
//   checkIndexes();
// https://rupaylender.com/read-more/pl/home-renovation-loan - (loan inseat of loan) -done
// https://rupaylender.com/read-more/pl/travel-loan - (loan inseat of loan) -done
// https://rupaylender.com/read-more/lap/lease-rental-discounting - (till discounting only) -done
// https://rupaylender.com/read-more/pl/education-loan- (loan inseat of loan) -done
// https://rupaylender.com/read-more/lap/balance-transfer-loan-against-property - (Coorect and indexed) - done
//   https://rupaylender.com/read-more/pl/medical-emergency-loan - (loan inseat of loan)- done
//   http://rupaylender.com/ - (not in sitemap - indexed) -done
//   http://www.rupaylender.com/ - (not in sitemap - Indexed) -done
//   https://www.rupaylender.com/career - (not in sitemap - Indexed) - done

//   https://rupaylender.com/blog-detail/683b5beeac1ce9e60b9fc45c (page is blank) - Remove this page on website and added provided slug with links

//   https://rupaylender.com/b2c/website-development (not in the sitemap and indexed) -done
//   https://rupaylender.com/b2c/lap-bt  (not in the sitemap and indexed) -done
//   https://rupaylender.com/blog/financial-plan-for-business-success, 
//   https://rupaylender.com/blog/b2b-fintech-platforms-lenders-borrowers,
//   https://rupaylender.com/blog/b2b-fintech-partnerships-model,
//   https://rupaylender.com/blog/instant-personal-loans-no-collateral-india,
//   https://rupaylender.com/blog/secure-instant-personal-loans-india,
//   https://rupaylender.com/blog/online-unsecured-loan-lenders-india,
//   https://rupaylender.com/blog/small-business-financing-strategies-2025,
//   https://rupaylender.com/blog/boost-revenue-with-financial-services
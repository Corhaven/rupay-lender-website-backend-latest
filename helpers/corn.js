// const cron = require('node-cron');
// // const { generateInvoicePDF } = require('../controllers/invoiceController');
// // const User = require('../models/User');

// // Utility to add months to a date
// const addMonths = (date, months) => {
//   const newDate = new Date(date);
//   newDate.setMonth(newDate.getMonth() + months);
//   return newDate;
// };

// // Schedule task to run at midnight every day to check for invoices that need to be generated
// cron.schedule('0 0 * * *', async () => {
//   const today = new Date();
//   const thirdDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 3);

//   if (today.toDateString() === thirdDayOfThisMonth.toDateString()) {
//     const users = await User.find({ loanStatus: 'completed' });

//     users.forEach(async (user) => {
//       const disbursalDate = new Date(user.disbursalDate);
//       const firstInvoiceDate = addMonths(disbursalDate, 1); // 3rd of the next month after disbursal
//       const secondInvoiceDate = addMonths(disbursalDate, 2); // 3rd of two months after disbursal
//       const thirdInvoiceDate = addMonths(disbursalDate, 3); // 3rd of three months after disbursal

//       const today = new Date();

//       // Check if today is one of the invoice dates
//       if (
//         today.toDateString() === firstInvoiceDate.toDateString() ||
//         today.toDateString() === secondInvoiceDate.toDateString() ||
//         today.toDateString() === thirdInvoiceDate.toDateString()
//       ) {
//         const invoiceUrl = await generateInvoicePDF(user);
//         // Update user document with the generated invoice URL or any other necessary actions
//         user.invoices.push({ date: today, url: invoiceUrl });
//         await user.save();
//       }
//     });
//     console.log('Invoices generated for the 3rd day of applicable months.');
//   }
// });
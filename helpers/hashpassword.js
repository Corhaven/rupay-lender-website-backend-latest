// import bcrypt from "bcrypt";

const bcrypt = require("bcrypt")
 const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

 const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// const currentMonthAndYearInString = () => {
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // Create a new Date object and convert to IST
//   const today = new Date();
//   const options = { timeZone: "Asia/Kolkata" }; // IST time zone

//   const istDate = new Date(today.toLocaleString("en-US", options));

//   const formattedDate = `${istDate.getDate()} ${ 
//     monthNames[istDate.getMonth()]
//   } ${istDate.getFullYear()}`;
//   //  console.log(formattedDate)
//   return formattedDate;
// };

const currentMonthAndYearInString = () => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get IST date using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "numeric",
    year: "numeric"
  });

  const parts = formatter.formatToParts(new Date());
  const day = parts.find(part => part.type === "day").value;
  const month = parts.find(part => part.type === "month").value;
  const year = parts.find(part => part.type === "year").value;

  return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
};

// Example usage
// console.log(currentMonthAndYearInString()); // Always correct: "24 February 2025"



module.exports = {hashPassword,comparePassword,currentMonthAndYearInString}
// models/Blog.js
const mongoose = require('mongoose');
// const { currentMonthAndYearInString } = require('../helpers/hashpassword');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
// currentMonthAndYearInString
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug:{
        type: String,
    // required: true,
  },
   type:{
        type: String,
    // required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bloggerName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
keyPoints:{
  type :Array,
  default: []
},
  date:{
                  type:String,
                  // A plain value here is computed once, when this file is first loaded,
                  // so every post a server process wrote carried the date of its last
                  // restart. A function runs per document.
                  // The server runs on UTC, so a post published late in the evening
                  // in India would otherwise be dated the previous day.
                  default: () => dayjs().tz('Asia/Kolkata').format("DD MMM YYYY")
              }
},{
  timestamps:true
});


module.exports  = mongoose.model('blog', blogSchema);


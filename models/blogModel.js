// models/Blog.js
const mongoose = require('mongoose');
// const { currentMonthAndYearInString } = require('../helpers/hashpassword');
const dayjs = require('dayjs');
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
                  default:dayjs(Date.now()).format("DD MMM YYYY")
              }
},{
  timestamps:true
});


module.exports  = mongoose.model('blog', blogSchema);


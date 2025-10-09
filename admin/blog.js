const blogModel = require("../models/blogModel");

 const createBlog = async (req, res) => {
    try {
        const files = req.files
        // console.log(files)
        const image = files.image ? files.image[0].location : " "
        // pic: files.pic ? files.pic[0].location : " ",

      const { title, description, bloggerName ,type,slug,keyPoints} = req.body;
      const newBlog = new blogModel({ title, description, bloggerName, image,type,slug,keyPoints });
      await newBlog.save();
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getBlog = async(req,res)=>{
    try {
        
    const blog  = await blogModel.find({ type: { $ne: "event" } }).sort({ createdAt: -1 }).lean()
    if(!blog){
      return res.status(500).send({success : false, message : "blogs not found"})
    }
    res.status(200).send({success : true , message : " blog get successfully",blog})
} catch (error) {
    res.status(500).send({success : false, message : error.message})

}
  }
  module.exports = {createBlog,getBlog}
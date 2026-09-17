const blogModel = require("../models/blogModel");

// The slug becomes part of a URL, so a value typed as "/my-post/" has to be
// stored as "my-post" — otherwise /blog/my-post asks for a slug nothing matches.
const cleanSlug = (value) => String(value || "")
  .trim()
  .toLowerCase()
  .replace(/^\/+|\/+$/g, "")
  .replace(/\s+/g, "-");

 const createBlog = async (req, res) => {
    try {
        const files = req.files
        // console.log(files)
        const image = files && files.image ? files.image[0].location : " "
        // pic: files.pic ? files.pic[0].location : " ",

      const { title, description, bloggerName ,type,slug,keyPoints} = req.body;
      const newBlog = new blogModel({ title, description, bloggerName, image,type,slug: cleanSlug(slug) || cleanSlug(title),keyPoints });
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
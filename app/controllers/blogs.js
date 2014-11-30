var Blog  = require('../models/blogs');
var utils = require('../utility');

// routes that end in /blogs
// create a blog (accessed by POST /api/blogs)
exports.postBlog = function (req, res){

  var blog = new Blog(); // create new instance of Blog model
  blog = utils.updateModel(blog, Blog, req.body);
  
  
  // save blog and check for errors
  blog.save(function(err) {
    if (err)
      res.send(err);

    res.json({message: 'Blog ' + blog._id + ' created!'});
  });
};
// get all the blogs (accessed at GET /api/blogs)
exports.getBlogs = function (req, res){
  Blog.find(function (err, blogs){
    if (err)
      res.send(err);

    res.json(blogs);
  });
};

// routes that end in /blogs/:blog_id
// get the blog with that id (accessed at GET /api/blogs/:blog_id)
exports.getBlog = function (req, res){
  blog.findById(req.params.blog_id, function (err, blog) {
    if (err)
      res.send(err);

    res.json(blog);
  });
};

// update the blog with this id (accessed at PUT /api/blogs/:blog_id)
exports.putBlog = function (req, res) {
  // user our blog model to find the blog we want
  Blog.findById( req.params.blog_id, function (err, blog) {
    if (err)
      res.send(err)

    blog = utils.updateModel(blog, Blog, req.body);

    // save the blog
    blog.save = function (err) {
      if (err)
        res.send(err);

      res.json({ message: 'Blog updated!' });
    };
  });
};

// delete the blog with this id (accessed at DELETE /api/blogs/:blog_id)
exports.deleteBlog = function (req, res) {
  Blog.remove({
    _id: req.params.blog_id
  }, function (err, blog) {
    if (err)
      res.send(err);

    res.json({ message: 'Blog ' + req.params.blog_id + ' deleted' });
  });
};
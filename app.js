var port =3000
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
mongoose.connect("mongodb://localhost/blog_app");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Scary Cat",
//     image: "https://images.unsplash.com/photo-1463008420065-8274332e2be8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4e604c4145ad16878f99be2fb31ff25c&auto=format&fit=crop&w=750&q=80",
//     body: "Looks like a chicken"
// }, function(err, blog){
//     if(err){
//         console.log(err);
//     } else{
//         console.log("New Entry");
//     }
// });

//Routes

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs: blogs});
        }
    });
    
});
//Index
app.get("/", function(req, res){
    res.redirect("/blogs");
});
//Create Form
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//Create new blog
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else{
            res.redirect("/blogs");
        }
    });
});
//Show one specific blog
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.render("show", {blog: foundBlog});
      }
   }); 
});
//Form to edit a blog
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});
//Edit a blog
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//Delete a blog
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});
app.listen(port, function(){
    console.log("Server is working");
});
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { result } = require("lodash");
const blogRoutes = require("./routes/blogRoutes");

//express app
const app = express();

//connect to mongoDB

const dbURI =
  "mongodb+srv://netninja:test1234@cluster0.ss9qiir.mongodb.net/node-tuts?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

//register view engine
app.set("view engine", "ejs");

//middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//routes
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

// mongoose and mongo sandbox routes
app.get("/add-blog", (req, res) => {
  const blog = new Blog({
    title: "new blog 2",
    snippet: "about my new  blog",
    body: "more about my new  blog",
  });
  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/single-blog", (req, res) => {
  Blog.findById("642e8dc3398b59ca2766dda9")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/", (req, res) => {
  //res.send("<h1>Home Page</h1>");

  const blogs = [
    {
      title: "Yoshi finds eggs",
      snippet: "lorem zksk fljsfljls sdljsdl slgjsljls",
    },
    {
      title: "Mario finds stars",
      snippet: "lorem zksk fljsfljls sdljsdl slgjsljls",
    },
    {
      title: "How to defeat bowser",
      snippet: "lorem zksk fljsfljls sdljsdl slgjsljls",
    },
  ];
  res.render("index", { title: "Home", blogs });
});

app.get("/about", (req, res) => {
  //res.send("<h1>About Page</h1>");

  res.render("about", { title: "About" });
});

//ridercts
app.get("/about-us", (req, res) => {
  res.redirect("/about");
});

//blog routes
app.use("/blogs", blogRoutes);

//404 page
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

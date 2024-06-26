const { log } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/MyImage")
  .then((result) => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const imageSchema = mongoose.Schema({
  name: String,
  file: String,
});
const Image = mongoose.model("Image", imageSchema);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  Image.find({})
    .then((users) => {
      res.render("image", { users: users });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/submit", upload.single("file"), (req, res) => {
  const image = new Image({
    name: req.body.name,
    file: req.file.filename,
  });
  image
    .save()
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(4000, () => {
  console.log("server is running");
});

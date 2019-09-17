const express = require("express");
const multer = require("multer");
const uuid = require("uuid/v4");
const path = require("path");
const bodyParser = require("body-parser");
const isAuth = require("./middleware/isAuth");
const adminOrTeacher = require("./middleware/AdminOrTeacher");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.json());

// Save to /images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname.split(".")[1]);
    const name = uuid() + "." + file.originalname.split(".")[1];
    cb(null, name);
  }
});

// Only accept JPG JPEG PNG
const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(
  multer({ storage: imageStorage, fileFilter: imageFilter }).single("image")
);

app.post("/uploadImage", isAuth, (req, res, next) => {
  console.log("[REQ.file]", req.file.filename);
  console.log(req.userId);
  User.findOne({ _id: req.userId })
    .then(user => {
      user.image = req.file.filename;
      return user.save();
    })
    .then(result => {
      res.status(200).json({
        name: req.file.filename
      });
      console.log("Saved to db and server with name");
    })
    .catch(err => {
      console.log(err);
    });
});

mongoose
  .connect(
    "mongodb+srv://adam:GKLCVf35uvgx3Bev@cluster0-p72yj.mongodb.net/tudastar"
  )
  .then(() => {
    app.listen(4002, () => {
      console.log("ImageServer running");
    });
  })
  .catch(err => {
    console.log(err);
  });

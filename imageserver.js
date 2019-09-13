const express = require("express");
const multer = require("multer");
const uuid = require("uuid/v4");
const path = require("path");
const bodyParser = require("body-parser");
const isAuth = require("./middleware/isAuth");

const app = express();

// Save to /images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname.split(".")[1]);
    const name = uuid() + "." + file.originalname.split(".")[1];
    cb(null, name);
    console.log("i runa fter callback", name);
  }
});

// Only accept JPG JPEG PNG
const fileFilter = (req, file, cb) => {
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
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(
  multer({ storage: imageStorage, fileFilter: fileFilter }).single("image")
);

app.post("/uploadImage", isAuth, (req, res, next) => {
  console.log("file:", req.file);
});

app.listen(4002, () => {
  console.log("App running");
});

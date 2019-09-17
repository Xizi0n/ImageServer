const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.role === "admin") {
    console.log("admin");
    next();
  } else {
    console.log("NOT ADMIN");
    const error = new Error("Not authorized.");
    error.statusCode = 403;
    throw error;
  }
};

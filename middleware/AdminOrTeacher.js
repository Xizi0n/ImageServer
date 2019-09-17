const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.role === "teacher" || req.role === "admin") {
    console.log("Teacher or Admin");
    next();
  } else {
    const error = new Error("Not authorized.");
    error.statusCode = 403;
    throw error;
  }
};

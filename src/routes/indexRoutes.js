const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("HomePage", {
    pageTitle: "Home Page",
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const loginRegisterController = require("../controller/loginRegisterController");

router.get("/register", loginRegisterController.register_get);
router.post("/register", loginRegisterController.register_post);

router.get("/login", loginRegisterController.login_get);
router.post("/login", loginRegisterController.login_post);

module.exports = router;

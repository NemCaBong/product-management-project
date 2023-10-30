const express = require("express");
const controller = require("../../controllers/client/user.controller");
const router = express.Router();
const userValidate = require("../../validates/client/user.validate");

router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);

router.get("/login", controller.login);
router.post("/login", userValidate.loginPost, controller.loginPost);

// Tính năng đăng xuất không cần gửi bằng phg thức POST.
router.get("/logout", controller.logout);
module.exports = router;

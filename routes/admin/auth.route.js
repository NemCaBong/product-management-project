const express = require("express");
const controller = require("../../controllers/admin/auth.controller");
const router = express.Router();
const validate = require("../../validates/admin/auth.validate");

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);
module.exports = router;

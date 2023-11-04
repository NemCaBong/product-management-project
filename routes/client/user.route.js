const express = require("express");
const controller = require("../../controllers/client/user.controller");
const router = express.Router();
const userValidate = require("../../validates/client/user.validate");
const authenMiddleware = require("../../middlewares/client/authen.middleware");

// Phần đường dẫn register
router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);

// phần đường dẫn login
router.get("/login", controller.login);
router.post("/login", userValidate.loginPost, controller.loginPost);

// Tính năng đăng xuất không cần gửi bằng phg thức POST.
// bởi không cần bảo mật.
router.get("/logout", controller.logout);

// Phần đường dẫn /password
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
// otp
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);

// reset
router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  userValidate.resetPasswordPost,
  controller.resetPasswordPost
);

router.get("/info", authenMiddleware.requireAuth, controller.info);
module.exports = router;

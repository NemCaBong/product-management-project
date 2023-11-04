const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generate = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    deleted: false,
    email: req.body.email,
  });

  // nếu đã tồn tại email thì ko cho tạo tk
  if (existEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }

  // mã hóa password
  req.body.password = md5(req.body.password);

  // tạo tk
  const user = await User(req.body);
  await user.save();

  // đăng ký thành công thì coi như đăng nhập thành công
  res.cookie("tokenUser", user.tokenUser);

  // trở về trang chủ
  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const password = md5(req.body.password);
  const email = req.body.email;
  const user = await User.findOne({
    deleted: false,
    email: email,
  });

  if (!user) {
    req.flash("error", "Chưa có tài khoản này");
    res.redirect("back");
    return;
  }

  if (password !== user.password) {
    req.flash("error", "Sai mật khẩu");
    res.redirect("back");
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", "Tài khoản đang bị khóa");
    res.redirect("back");
    return;
  }
  // trả ra token vào cookies
  res.cookie("tokenUser", user.tokenUser);

  // trở về trang chủ
  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  // Xóa token trong cookies là xong
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  // tìm email có tồn tại hay ko.
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `Email ${email} không tồn tại`);
    res.redirect("back");
    return;
  }
  // Nếu muốn thêm tính năng ko gửi liên tục OTP thì
  // có thể check bảng forgotpassword nếu có email đó rồi thì ko gửi cái mới nx

  // Nếu có tk đó thì chúng ta
  // Lưu thông tin vào DB
  const otp = generate.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    // 10 từ thời gian hiện tại
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Nếu tồn tại email thì gửi mã OTP qua mail. (viết sau)
  const subject = "Mã OTP xác minh lấy lại mk";
  const html = `Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút.`;

  sendMailHelper.sendMail(email, subject, html);

  // thêm cái query email vào để bên kia lấy email luôn.
  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  // bây giờ email sẽ gửi qua body của form
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  // Nếu không hợp lệ
  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect("back");
    return;
  }

  // Nếu ông ấy có mã OTP rồi coi như cta xác thực thành công
  // Trả lại cho ông ấy cái token user của mình, lưu vào cookies.
  // để khi ngta thay đổi mk thì gửi ngầm theo cái token để biết là user
  // nào để có thể chỉnh sửa

  const user = await User.findOne({
    email: email,
  });
  // đưa token vào cookies.
  res.cookie("tokenUser", user.tokenUser);

  // sang trang thay đổi mk
  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;

  res.render("client/pages/user/reset-password", {
    pageTitle: "Thay đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  // việc check confirmPass với password được check tại phần
  // validates được dùng trong thư mục user.route rồi.
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );
  // trở về trang chủ
  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};

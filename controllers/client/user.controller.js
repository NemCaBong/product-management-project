const md5 = require("md5");
const User = require("../../models/user.model");
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
    pageTitle: "Đăng nhập tài kho",
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

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
  req.body.email = md5(req.body.email);

  // tạo tk
  const user = await User(req.body);
  await user.save();

  // đăng ký thành công thì coi như đăng nhập thành công
  res.cookie("tokenUser", user.tokenUser);

  // trở về trang chủ
  res.redirect("/");
};

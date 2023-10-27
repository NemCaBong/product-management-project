module.exports.registerPost = (req, res, next) => {
  // đảm bảo rằng chúng ta check trước khi cho vào DB
  // check kể cả khi ng dùng F12 xóa đi required.
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ và tên!");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    res.redirect("back");
    return;
  }

  if (!req.body.password) {
    req.flash("error", "Vui lòng nhập mật khẩu!");
    res.redirect("back");
    return;
  }
  next();
};

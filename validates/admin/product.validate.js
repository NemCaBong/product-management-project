module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tiêu đề sản phẩm!");
    res.redirect("back");
    return;
  }
  // đây là 1 hàm để next sang bước kế tiếp
  // => middleware kế tiếp
  next();
};

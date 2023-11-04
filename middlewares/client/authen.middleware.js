const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  // Hàm bắt buộc phải chạy qua.
  // tất cả key trong cookies đều ở trong req.cookies

  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({
      deleted: false,
      tokenUser: req.cookies.tokenUser,
    }).select("-password");

    // nếu tìm đc user
    if (user) {
      res.locals.user = user;
      next();
    } else {
      res.redirect(`/user/login`);
    }
  }
};

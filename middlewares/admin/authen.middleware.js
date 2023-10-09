const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
  // Hàm bắt buộc phải chạy qua.
  // tất cả key trong cookies đều ở trong req.cookies
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({
      deleted: false,
      token: req.cookies.token,
    });
    if (user) {
      next();
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
  }
};

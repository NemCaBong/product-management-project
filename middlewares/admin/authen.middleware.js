const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
module.exports.requireAuth = async (req, res, next) => {
  // Hàm bắt buộc phải chạy qua.
  // tất cả key trong cookies đều ở trong req.cookies
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({
      deleted: false,
      token: req.cookies.token,
    }).select("-password");
    if (user) {
      const role = await Role.findOne({
        _id: user.role_id,
      });

      // tạo ra biến toàn cục là user và role
      // để sử dụng trong toàn apps.
      res.locals.user = user;
      res.locals.role = role;
      next();
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
  }
};

const User = require("../../models/user.model");
// Đây là middleware để lo liệu khi mà người dùng đăng nhập thành công rồi.
module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    // status để tạo ra nhiều trạng thái có thể có cho sản phẩm
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
      status: "active",
    }).select("-password");
  }

  // Nếu có thì trả về thông tin user
  if (user) {
    res.locals.user = user;
  }
  // Nếu không có thì vẫn vào như bình thường.
  next();
};

const User = require("../../models/user.model");

module.exports.notFriend = async (req, res) => {
  const userID = res.locals.user.id;

  const users = await User.find({
    // lấy ra các user không phải user hiện tại
    _id: { $ne: userID },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  console.log(users);
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

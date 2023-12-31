const User = require("../../models/user.model");
const usersSocket = require("../../socket/client/users.socket");

module.exports.notFriend = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userID = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userID,
  });

  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  const friendListID = myUser.friendList.map((friend) => friend.user_id);

  const users = await User.find({
    $and: [
      { _id: { $ne: userID } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
      { _id: { $nin: friendListID } },
    ],
    // lấy ra các user không phải user hiện tại
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

module.exports.request = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userID = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userID,
  });

  const users = await User.find({
    _id: { $in: myUser.requestFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời đã gửi",
    users: users,
  });
};

module.exports.accept = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userID = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userID,
  });

  const users = await User.find({
    _id: { $in: myUser.acceptFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/accept.pug", {
    pageTitle: "Lời mời kết bạn",
    users: users,
  });
};

module.exports.friends = async (req, res) => {
  // socket
  usersSocket(res);
  // end socket

  const userID = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userID,
  });

  const friendListID = myUser.friendList.map((friend) => friend.user_id);

  const friends = await User.find({
    _id: { $in: friendListID },
    status: "active",
    deleted: false,
  }).select("id avatar fullName statusOnline");

  for (const friend of friends) {
    const friendInfo = myUser.friendList.find(
      (friendObj) => friendObj.user_id === friend.id
    );
    friend.infoFriend = friendInfo;
  }

  res.render("client/pages/users/friends.pug", {
    pageTitle: "Danh sách bạn bè",
    friends: friends,
  });
};

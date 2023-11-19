const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userID = res.locals.user.id;

  const listRoomChat = await RoomChat.find({
    "users.user_id": userID,
    typeRoom: "group",
    deleted: false,
  });

  console.log(listRoomChat);

  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  // lấy ra friendList từ user hiện tại
  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false,
    }).select("fullName avatar");

    friend.infoFriend = infoFriend;
  }
  console.log(friendList);

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng",
    friendList: friendList,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersID = req.body.usersID;
  const roomData = {
    title: title,
    users: [],
    typeRoom: "group",
  };
  // đẩy user vào phòng chat
  for (const userID of usersID) {
    roomData.users.push({
      user_id: userID,
      role: "user",
    });
  }
  roomData.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });
  // end đẩy

  const roomChat = new RoomChat(roomData);
  await roomChat.save();
  // sang luôn trang phòng chat
  res.redirect(`/chat/${roomChat.id}`);
};

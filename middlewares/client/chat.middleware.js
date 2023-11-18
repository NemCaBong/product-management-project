const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccepted = async (req, res, next) => {
  const roomChatID = req.params.roomChatID;
  const userID = res.locals.user.id;

  const existsInRoomChat = await RoomChat.findOne({
    _id: roomChatID,
    // kiểm tra trong mảng object với user_id = userID
    "users.user_id": userID,
    deleted: false,
  });

  // Nếu có thì mới cho vào trang chat
  if (existsInRoomChat) {
    next();
  } else {
    res.redirect("/");
  }
};

const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../socket/client/chat.socket");

// [GET] /chat/:roomChatID
module.exports.index = async (req, res) => {
  const roomChatID = req.params.roomChatID;

  const roomChatTitle = await RoomChat.findOne({
    _id: roomChatID,
  }).select("title");

  // Handle chatting using socket.
  chatSocket(req, res);
  // end Socket.io

  const chats = await Chat.find({
    deleted: false,
    room_chat_id: roomChatID,
  });

  for (let chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
      deleted: false,
    }).select("fullName");

    // gán thêm infoUser cho đoạn tin nhắn
    chat.infoUser = infoUser;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Trang chat",
    chats: chats,
    roomChatTitle: roomChatTitle,
  });
};

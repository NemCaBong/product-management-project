const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../socket/client/chat.socket");
// [GET] /chat
module.exports.index = async (req, res) => {
  // Handle chatting using socket.
  chatSocket(res);
  // end Socket.io

  const chats = await Chat.find({
    deleted: false,
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
  });
};

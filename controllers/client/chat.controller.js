const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
// [GET] /chat
module.exports.index = async (req, res) => {
  // lấy ra userid theo res.locals
  // bởi đã force phải có res.locals.user trong file auth.middleware
  const userID = res.locals.user.id;

  // dùng biến _io của global
  // socket.io
  _io.once("connection", (socket) => {
    // console.log("a user connected", socket.id);

    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userID,
        content: content,
      });
      // lưu đoạn code vào db.
      await chat.save();
    });
  });

  // end socket.io

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

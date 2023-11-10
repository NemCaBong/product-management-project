const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
// [GET] /chat
module.exports.index = async (req, res) => {
  // lấy ra userid theo res.locals
  // bởi đã force phải có res.locals.user trong file auth.middleware
  const userID = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // dùng biến _io của global
  // socket.io
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userID,
        content: content,
      });
      // lưu đoạn code vào db.
      await chat.save();

      // sau khi lưu vào database xong thì chúng ta trả lại
      // cái tin nhắn cho client side để nó hiển thị realtime.
      _io.emit("SERVER_RETURN_MESSAGE", {
        fullName: fullName,
        user_id: userID,
        content: content,
      });
    });

    // nhận sự kiện client đang type
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      // trả về giá trị người dùng đang type cho tất cả
      // những người khác ngoài người đang type
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        user_id: userID,
        type: type,
        fullName: fullName,
      });
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

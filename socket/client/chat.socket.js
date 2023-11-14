const Chat = require("../../models/chat.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (res) => {
  // lấy ra userid theo res.locals
  // bởi đã force phải có res.locals.user trong file auth.middleware
  const userID = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // dùng biến _io của global
  // socket.io
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      // data.images: sẽ đc lưu ở dạng các buffer
      let images = [];
      for (const image of data.images) {
        // các image ở dạng buffer
        const link = await uploadToCloudinary(image);
        images.push(link);
      }

      const chat = new Chat({
        user_id: userID,
        content: data.content,
        images: images,
      });

      // lưu đoạn code vào db.
      await chat.save();

      // sau khi lưu vào database xong thì chúng ta trả lại
      // cái tin nhắn cho client side để nó hiển thị realtime.
      _io.emit("SERVER_RETURN_MESSAGE", {
        fullName: fullName,
        user_id: userID,
        content: data.content,
        images: images,
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
};

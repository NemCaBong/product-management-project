// [GET] /chat
module.exports.index = async (req, res) => {
  // dùng biến _io của global
  _io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
  });

  res.render("client/pages/chat/index", {
    pageTitle: "Trang chat",
  });
};

const User = require("../../models/user.model");
module.exports = (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;

      console.log(myUserID);
      console.log(userID);

      // Thêm id của A vào acceptFriends của B

      // kiểm tra exists A trong B hay chưa
      const existsIDinAcceptFriends = await User.findOne({
        _id: userID,
        acceptFriends: myUserID,
      });

      if (!existsIDinAcceptFriends) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $push: { acceptFriends: myUserID },
          }
        );
      }

      // kết thúc thêm id

      // Thêm id của B vào requestFriends của A
      const existsIDinRequestFriends = await User.findOne({
        _id: myUserID,
        requestFriends: userID,
      });

      if (!existsIDinRequestFriends) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $push: { requestFriends: userID },
          }
        );
      }

      // kết thúc thêm id
    });

    socket.on("CLIENT_CANCEL_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;

      // Xóa id của A vào acceptFriends của B

      // kiểm tra exists A trong B hay chưa
      const existsIDinAcceptFriends = await User.findOne({
        _id: userID,
        acceptFriends: myUserID,
      });

      if (existsIDinAcceptFriends) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $pull: { acceptFriends: myUserID },
          }
        );
      }

      // Xóa id của B vào requestFriends của A
      const existsIDinRequestFriends = await User.findOne({
        _id: myUserID,
        requestFriends: userID,
      });

      if (existsIDinRequestFriends) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $pull: { requestFriends: userID },
          }
        );
      }
    });
  });
};

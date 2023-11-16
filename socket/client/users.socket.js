const User = require("../../models/user.model");
module.exports = (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;
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

      // Lấy ra số người gửi lời mời kết bạn cho B
      // và trả về client
      const infoUserReceiveFriendRequest = await User.findOne({
        _id: userID,
      });
      const lengthAcceptFriends =
        infoUserReceiveFriendRequest.acceptFriends.length;

      // trả về ID của người đc kết bạn
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        user_id: userID,
        lengthAcceptFriends: lengthAcceptFriends,
      });

      // lấy info của người gửi trả về cho ng nhận lmkban
      const infoUserSender = await User.findOne({
        _id: myUserID,
      });
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

      // Trả về số lượng người gửi lời mời kết bạn
      const infoUserReceiveFriendRequest = await User.findOne({
        _id: userID,
      });
      const lengthAcceptFriends =
        infoUserReceiveFriendRequest.acceptFriends.length;

      // trả về ID của người đc kết bạn
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        user_id: userID,
        lengthAcceptFriends: lengthAcceptFriends,
      });
    });

    socket.on("CLIENT_REFUSE_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;

      // Xóa id trong acceptFriends của ng đc nhận lmkb

      const existsIDinAcceptFriends = await User.findOne({
        _id: myUserID,
        acceptFriends: userID,
      });

      if (existsIDinAcceptFriends) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $pull: { acceptFriends: userID },
          }
        );
      }

      // Xóa id trong requestFriends của người gửi kban
      const existsIDinRequestFriends = await User.findOne({
        _id: userID,
        requestFriends: myUserID,
      });

      if (existsIDinRequestFriends) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $pull: { requestFriends: myUserID },
          }
        );
      }
    });

    socket.on("CLIENT_ACCEPT_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;

      // logic xóa tương tự như hủy lời mời kb
      // Xóa id trong acceptFriends của ng đc nhận lmkb
      // Thêm bạn vào friendList với room_chat_id
      const existsIDinAcceptFriends = await User.findOne({
        _id: myUserID,
        acceptFriends: userID,
      });

      if (existsIDinAcceptFriends) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $push: {
              friendList: {
                user_id: userID,
                room_chat_id: "",
              },
            },
            $pull: { acceptFriends: userID },
          }
        );
      }

      // Thêm bạn vào friendList
      // Xóa id trong requestFriends của người gửi kban
      const existsIDinRequestFriends = await User.findOne({
        _id: userID,
        requestFriends: myUserID,
      });

      if (existsIDinRequestFriends) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $push: {
              friendList: {
                user_id: myUserID,
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: myUserID },
          }
        );
      }
    });
  });
};

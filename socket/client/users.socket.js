const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
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
      }).select("id avatar fullName");

      // gửi về thông tin người mình đang gửi lmkb
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userID: userID,
        infoUserSender: infoUserSender,
      });
    });

    // Lo liệu phần hủy gửi lời mời kết bạn
    // hủy khác với từ chối lmkban
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

      // Gửi thông tin người hủy kết bạn
      // và người bị hủy
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userIDReceiver: userID,
        userIDSender: myUserID,
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

      // check tồn tại
      const existsIDinAcceptFriends = await User.findOne({
        _id: myUserID,
        acceptFriends: userID,
      });

      // Thêm bạn vào friendList
      // Xóa id trong requestFriends của người gửi kban
      const existsIDinRequestFriends = await User.findOne({
        _id: userID,
        requestFriends: myUserID,
      });

      let roomChat;

      if (existsIDinAcceptFriends && existsIDinRequestFriends) {
        const roomData = {
          typeRoom: "friend",
          users: [
            {
              user_id: myUserID,
              role: "superAdmin",
            },
            {
              user_id: userID,
              role: "superAdmin",
            },
          ],
        };

        roomChat = new RoomChat(roomData);
        roomChat.save();

        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $push: {
              friendList: {
                user_id: userID,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { acceptFriends: userID },
          }
        );

        await User.updateOne(
          {
            _id: userID,
          },
          {
            $push: {
              friendList: {
                user_id: myUserID,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { requestFriends: myUserID },
          }
        );
      }
    });
  });
};

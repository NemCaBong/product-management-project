const User = require("../../models/user.model");
module.exports = (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;

      // console.log(myUserID);
      // console.log(userID);

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

const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    // tokenUser để phân biệt so với phần admin
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    // tùy bài toán có thể cần admin duyệt trạng thái
    // có bài toán thì đki xong là có thể hoạt động luôn
    status: {
      type: String,
      default: "active",
    },
    // những người mà chúng ta gửi lmkban
    requestFriends: Array,
    // những người kb với cta
    acceptFriends: Array,
    // danh sách bạn bè
    friendList: [
      {
        user_id: String,
        room_chat_id: String,
      },
    ],
    statusOnline: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema, "users");
module.exports = User;

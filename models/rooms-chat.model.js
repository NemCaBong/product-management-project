const mongoose = require("mongoose");

const roomschatSchema = new mongoose.Schema(
  {
    title: String,
    // nếu chat 2 ng thì avatar chính là của người kia
    avatar: String,
    // kiểu phòng chat "friend" - "group"
    typeRoom: String,
    // trạng thái phòng: khóa, phòng chỉ có trưởng phó chat.
    status: String,
    // Mảng các user
    users: [
      {
        user_id: String,
        // Quyền của họ trong phòng chat.
        role: String,
      },
    ],
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

const RoomChat = mongoose.model("RoomChat", roomschatSchema, "rooms-chat");

module.exports = RoomChat;

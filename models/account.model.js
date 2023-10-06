const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    // token là string random 20-30 ký tự
    // chỉ ông nào có tài khoản mới có token này mà thôi
    // khi ông ấy login thành công thì chúng ta lưu token
    // ở phía client. Vào trang nào dạng private thì phải check token.
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
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
const Account = mongoose.model("Account", accountSchema, "accounts");
module.exports = Account;

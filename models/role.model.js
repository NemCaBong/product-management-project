const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    // các nhóm quyền mà chức vụ này có thể đảm nhận
    permissions: {
      type: Array,
      default: [],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    updatedBy: {
      account_id: String,
      updatedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;

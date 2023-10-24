const mongoose = require("mongoose");

// lưu lại cart_id để có thể truy vấn ra nhiều cái đơn hàng
// cùng sử dụng cái giỏ hàng này để mua

// userInfo: là để cho người chưa đăng nhập
// lưu thông tin của  họ vào đó
// có thể đó chính là địa chỉ và liên hệ để chuyển hàng tới

// lưu lại products vào trong order.model trong khi
// có cartID rồi và có thể ref để lấy ra
// Nhưng thực chất chúng ta sẽ xóa cart và products trong đó
// tại vì mỗi ng có 1 cart 1 cart có nhiều orders.
const orderSchema = new mongoose.Schema(
  {
    // user_id: String,

    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        quantity: Number,
        price: Number,
        discountPercentage: Number,
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
const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;

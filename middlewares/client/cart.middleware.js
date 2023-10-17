const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  // Kiểm tra trong cookies có cartID hay không
  // Nếu chưa tồn tại giỏ hàng trong cookies thì chúng ta

  if (!req.cookies.cartID) {
    // Tạo giỏ hàng
    const cart = new Cart();
    await cart.save();

    const expiredTime = 60 * 60 * 24 * 365 * 1000;
    res.cookie("cartID", cart.id, {
      expries: new Date(Date.now() + expiredTime),
    });
  } else {
    // Lấy ra giỏ hàng từ DB
  }
  next();
};

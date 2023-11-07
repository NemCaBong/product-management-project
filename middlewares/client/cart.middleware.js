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
      expires: new Date(Date.now() + expiredTime),
    });
  } else {
    // Lấy ra giỏ hàng từ DB
    const cart = await Cart.findOne({
      _id: req.cookies.cartID,
    });

    cart.totalQuantity = cart.products.reduce(
      (count, item) => count + item.quantity,
      0
    );
    res.locals.miniCart = cart;
  }
  next();
};

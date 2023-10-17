const Cart = require("../../models/cart.model");

// [POST] /cart/add/:productID
module.exports.addPost = async (req, res) => {
  // lấy ra sản phẩm cần thêm vào giỏ hàng vào lưu vào DB
  const productID = req.params.productID;
  const quantity = parseInt(req.body.quantity);
  const cartID = req.cookies.cartID;

  const cart = await Cart.findOne({
    _id: cartID,
  });

  // tìm kiếm xem trong giỏ đã có sản phẩm đó chưa
  const existInCart = cart.products.find(
    (item) => item.product_id == productID
  );

  if (existInCart) {
    // cập nhật lại giỏ hàng
    await Cart.updateOne(
      {
        _id: cartID,
        "products.product_id": productID,
      },
      { $set: { "products.$.quantity": quantity + existInCart.quantity } }
    );
  } else {
    // thêm mới object
    const objectCart = {
      product_id: productID,
      quantity: quantity,
    };

    await Cart.updateOne(
      {
        _id: cartID,
      },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
  res.redirect("back");
};

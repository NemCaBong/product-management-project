const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET] /cart
module.exports.index = async (req, res) => {
  const cartID = req.cookies.cartID;

  const cart = await Cart.findOne({
    _id: cartID,
  });
  if (cart.products.length > 0) {
    // Lấy ra thông tin các sản phẩm trong giỏ hàng
    // và gán chúng vào trong cart.products
    for (const item of cart.products) {
      const productID = item.product_id;
      const productInfo = await Product.findOne({
        _id: productID,
      }).select("title thumbnail slug price discountPercentage");
      productInfo.newPrice = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = productInfo.newPrice * item.quantity;
    }
  }

  cart.totalPrice = cart.products.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  res.render("client/pages/cart/index", {
    pageTitle: "Trang giỏ hàng",
    cartDetail: cart,
  });
};

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

// [GET] /cart/delete/:productID
module.exports.delete = async (req, res) => {
  const cartID = req.cookies.cartID;
  const productID = req.params.productID;
  await Cart.updateOne(
    {
      _id: cartID,
    },
    {
      $pull: { products: { product_id: productID } },
    }
  );

  req.flash("success", "Đã xóa sản phẩm trong giỏ hàng");
  res.redirect("back");
};

// [GET] /cart/update/:productID/:quantity
module.exports.updateQuantity = async (req, res) => {
  const cartID = req.cookies.cartID;
  const productID = req.params.productID;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartID,
      "products.product_id": productID,
    },
    {
      $set: { "products.$.quantity": quantity },
    }
  );
  req.flash("success", "Cập nhật số lượng sản phẩm thành công");
  res.redirect("back");
};

const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartID = req.cookies.cartID;

  const cart = await Cart.findOne({
    _id: cartID,
  });
  if (cart.products.length > 0) {
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

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartID = req.cookies.cartID;
  // Chính là object gừi qua từ form.
  const userInfo = req.body;

  // Lấy ra các thông tin trong giỏ
  const cart = await Cart.findOne({
    _id: cartID,
  });

  const products = [];

  // Lấy ra thông tin cần thiết của từng sản phẩm
  for (let product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  // Tạo ra order rồi lưu vào DB
  const orderInfo = {
    cart_id: cartID,
    products: products,
    userInfo: userInfo,
  };

  const order = new Order(orderInfo);
  await order.save();

  // Cập nhật lại cái sản phẩm trong giỏ hàng thành rỗng
  await Cart.updateOne(
    {
      _id: cartID,
    },
    {
      products: [],
    }
  );

  // Sau khi lưu order xong sẽ có được cái id.
  res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderID
module.exports.success = async (req, res) => {
  // lấy ra thông tin đơn hàng
  const order = await Order.findOne({
    _id: req.params.orderID,
  });
  for (const product of order.products) {
    // lấy ra tên và ảnh của từng sản phẩm
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;
    product.newPrice = productsHelper.priceNewProduct(product);
    product.totalPrice = product.newPrice * product.quantity;
  }
  order.totalPrice = order.products.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};

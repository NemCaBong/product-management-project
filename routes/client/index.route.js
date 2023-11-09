const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
// middleware
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");

module.exports = (app) => {
  // gần như trang nào cũng cần dùng đến middleware này để có productCategory
  // Vậy nên chúng ta app.use để mặc định chạy câu lệnh này luôn
  app.use(categoryMiddleware.category);
  app.use(settingMiddleware.settingGeneral);

  // Tất cả các trang đều cần token của user hiện tại.
  app.use(userMiddleware.infoUser);
  app.use(cartMiddleware.cartId);

  app.use("/", homeRoutes);
  app.use("/chat", chatRoutes);
  app.use("/cart", cartRoutes);
  app.use("/user", userRoutes);
  app.use("/search", searchRoutes);
  app.use("/products", productRoutes);
  app.use("/checkout", checkoutRoutes);
};

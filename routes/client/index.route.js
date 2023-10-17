const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
// middleware
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
  // gần như trang nào cũng cần dùng đến middleware này để có productCategory
  // Vậy nên chúng ta app.use để mặc định chạy câu lệnh này luôn
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);

  app.use("/cart", cartRoutes);
  app.use("/", homeRoutes);
  app.use("/search", searchRoutes);
  app.use("/products", productRoutes);
};

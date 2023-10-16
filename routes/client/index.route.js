const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
module.exports = (app) => {
  // gần như trang nào cũng cần dùng đến middleware này để có productCategory
  // Vậy nên chúng ta app.use để mặc định chạy câu lệnh này luôn
  app.use(categoryMiddleware.category);

  app.use("/", homeRoutes);
  app.use("/search", searchRoutes);
  app.use("/products", productRoutes);
};

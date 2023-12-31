// router
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./roles.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");
const settingRoutes = require("./setting.route");
const userRoutes = require("./user.route");
const orderRoutes = require("./order.route");
// get system variables
const systemConfig = require("../../config/system");
// auth middleware
const authMiddleware = require("../../middlewares/admin/authen.middleware");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoutes
  );
  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);
  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
  app.use(
    PATH_ADMIN + "/product-category",
    authMiddleware.requireAuth,
    productCategoryRoutes
  );
  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);

  app.use(
    PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myAccountRoutes
  );
  app.use(PATH_ADMIN + "/users", authMiddleware.requireAuth, userRoutes);
  app.use(PATH_ADMIN + "/orders", authMiddleware.requireAuth, orderRoutes);

  app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);
};

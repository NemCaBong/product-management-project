const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");
const md5 = require("md5");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  // bộ lọc
  const filterStatus = filterStatusHelper(req.query);
  // hết bộ lọc

  // dieu kien search DB
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Phan phan trang
  // tồng sản phẩm trong DB.
  const totalItems = await Order.count(find);
  const objectPagination = paginationHelper(req.query, totalItems);
  // ket thuc phan trang

  // Sort

  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = parseInt(req.query.sortValue);
  } else {
    // mặc định sử dụng vị trí giảm dần
    sort.createdAt = -1;
  }
  // End sort

  const orders = await Order.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems);

  for (const order of orders) {
    let totalPrice = 0;
    for (const product of order.products) {
      const productName = await Product.findOne({
        _id: product.product_id,
      }).select("title");

      product["title"] = productName.title;

      // tính tổng tiền
      product.totalPriceProduct = Math.round(
        (product.price *
          product.quantity *
          (100 - product.discountPercentage)) /
          100
      );
      totalPrice += product.totalPriceProduct;
    }
    order.totalPrice = totalPrice;
  }

  res.render("admin/pages/orders/index.pug", {
    pageTitle: "Quản lý người dùng",
    orders: orders,
    filterStatus: filterStatus,
    pagination: objectPagination,
  });
};

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findOne({
    _id: id,
    deleted: false,
  });

  let totalPrice = 0;
  for (const product of order.products) {
    const productName = await Product.findOne({
      _id: product.product_id,
    }).select("title");

    product["title"] = productName.title;
    product.totalPriceProduct = Math.round(
      (product.price * product.quantity * (100 - product.discountPercentage)) /
        100
    );
    totalPrice += product.totalPriceProduct;
  }
  order.totalPrice = totalPrice;

  res.render("admin/pages/orders/detail.pug", {
    pageTitle: "Chi tiết đơn hàng",
    order: order,
  });
};

// [DELETE] /admin/orders/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Order.updateOne(
    { _id: id },
    {
      deleted: true,
    }
  );
  res.redirect("back");
};

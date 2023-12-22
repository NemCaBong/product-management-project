const User = require("../../models/user.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const md5 = require("md5");

// [GET] /admin/users
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

  // phan tim kiem
  const objectSearch = searchHelper(req.query);
  if (objectSearch.keyword) {
    find.fullName = objectSearch.keywordRegex;
  }
  // het tim kiem

  // Phan phan trang
  // tồng sản phẩm trong DB.
  const totalItems = await User.count(find);
  const objectPagination = paginationHelper(req.query, totalItems);
  // ket thuc phan trang

  // Sort

  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    // mặc định sử dụng vị trí giảm dần
    sort.fullName = "asc";
  }
  // End sort

  const users = await User.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItems)
    .select("-password -token");

  // lấy ra danh sách bạn bè
  for (const user of users) {
    const friendList = user.friendList;

    if (friendList != []) {
      for (let i = 0; i < friendList.length; i++) {
        const friendObj = await User.findOne({
          _id: friendList[i].user_id,
          deleted: false,
        }).select("fullName");
        if (friendObj) user.friendList[i]["fullName"] = friendObj.fullName;
      }
    }
  }

  res.render("admin/pages/users/index.pug", {
    pageTitle: "Quản lý người dùng",
    users: users,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [GET] /admin/users/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({
    _id: id,
    deleted: false,
  }).select("-password -token");

  const friendList = user.friendList;

  if (friendList != []) {
    for (let i = 0; i < friendList.length; i++) {
      const friendObj = await User.findOne({
        _id: friendList[i].user_id,
        deleted: false,
      }).select("fullName");

      user.friendList[i]["fullName"] = friendObj.fullName;
    }
  }
  res.render("admin/pages/users/detail.pug", {
    pageTitle: "Chi tiết người dùng",
    user: user,
  });
};

// [GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const user = await User.findOne({
    _id: id,
    deleted: false,
  }).select("-tokenUser -password");

  res.render("admin/pages/users/edit.pug", {
    pageTitle: "Chỉnh sửa người dùng",
    user: user,
  });
};

// [PATCH] /admin/users/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    let user = {};
    user["email"] = req.body.email;
    user["fullName"] = req.body.fullName;
    user["status"] = req.body.status;

    // có thể ko upload ảnh.
    if (req.body.avatar) {
      user["avatar"] = req.body.avatar;
    }

    await User.updateOne(
      {
        _id: id,
      },
      user
    );

    req.flash("success", "Edit thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.log(error);
    res.flash("error", "Edit thất bại!");
    res.redirect("back");
  }
};

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    await User.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!");
    console.log(error);
  }
  res.redirect("back");
};

// [PATCH] /admin/users/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await User.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`
      );
      break;

    case "inactive":
      await User.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`
      );
      break;

    case "delete-all":
      await User.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
        }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
      break;

    default:
      break;
  }

  res.redirect("back");
};

// [DELETE] /admin/users/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await User.updateOne(
    { _id: id },
    {
      deleted: true,
    }
  );
  res.redirect("back");
};

// [GET] /admin/users/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/users/create", {
    pageTitle: "Thêm mới người dùng",
  });
};

// [POST] /admin/users/create
module.exports.createPost = async (req, res) => {
  try {
    const user = {};
    user["fullName"] = req.body.fullName;
    user["email"] = req.body.email;
    user["password"] = md5(req.body.password);
    if (req.body.avatar) {
      user["avatar"] = req.body.avatar;
    }
    const newUser = new User(user);
    await newUser.save();

    res.redirect(`${systemConfig.prefixAdmin}/users`);
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};

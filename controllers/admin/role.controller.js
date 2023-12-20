const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);

  for (const record of records) {
    // lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: record.createdBy.account_id,
    });

    // không phải cái nào cx có người tạo
    if (user) {
      record.accountFullName = user.fullName;
    }

    //lấy ra thông tin người chỉnh sửa gần nhất
    // updatedBy thay đổi => product cx thay đổi.
    const updatedBy = record.updatedBy.slice(-1)[0];

    if (updatedBy) {
      const updatedUser = await Account.findOne({
        _id: updatedBy.account_id,
      });

      updatedBy.accountFullName = updatedUser.fullName;
    }
  }
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

// [GET] admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

// [POST] admin/roles/create
module.exports.createPost = async (req, res) => {
  if (req.body) {
    req.body.createdBy = {
      account_id: res.locals.user.id,
      createdAt: new Date(),
    };

    const record = new Role(req.body);
    await record.save();
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const record = await Role.findOne({
      deleted: false,
      _id: id,
    });
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      record: record,
    });
  } catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if (req.body) {
      const id = req.params.id;
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      await Role.updateOne(
        { _id: id },
        {
          ...req.body,
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash("success", "Cập nhật nhóm quyền thành công");
    }
  } catch (err) {
    req.flash("error", "Cập nhật nhóm quyền thất bại");
    res.redirect("back");
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] admin/roles/permissions
module.exports.permissions = async (req, res) => {
  try {
    const records = await Role.find({
      deleted: false,
    });
    res.render("admin/pages/roles/permissions", {
      pageTitle: "Phân quyền",
      records: records,
    });
  } catch (err) {
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
  }
};

// [PATCH] admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    // khi truyền nó dưới dạng JSON vào trong ô input có name là "permissions"
    // Khi chúng ta chuyển về dạng Object trong JS thì cần phải .permissons vào.
    const permissions = JSON.parse(req.body.permissions);
    if (permissions) {
      const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      };
      permissions.forEach(async (item) => {
        await Role.updateOne(
          { _id: item.id },
          { permissions: item.permissions, $push: { updatedBy: updatedBy } }
        );
      });
    }

    req.flash("success", "Cập nhật phân quyền thành công");
  } catch (err) {
    req.flash("error", "Cập nhật phân quyền thất bại");
  }
  res.redirect(`back`);
};

// [GET] admin/roles/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const roleID = req.params.id;
    const role = await Role.findOne({
      deleted: false,
      _id: roleID,
    });

    let permissionsName = {
      "products-category": "Danh mục sản phẩm",
      products: "Sản phẩm",
      roles: "Nhóm quyền",
      accounts: "Tài khoản",
    };

    let permissionsAct = {
      view: "Xem",
      create: "Thêm mới",
      edit: "Sửa",
      delete: "Xóa",
      permissions: "Phân quyền",
    };

    let permissionOfRole = {};

    for (let permission of role.permissions) {
      let [name, act] = permission.split("_");
      name = permissionsName[name];
      act = permissionsAct[act];
      if (!permissionOfRole.hasOwnProperty(name)) {
        permissionOfRole[name] = [];
        permissionOfRole[name].push(act);
      } else {
        permissionOfRole[name].push(act);
      }
    }

    res.render("admin/pages/roles/detail", {
      userRole: res.locals.role,
      role: role,
      rolePermissions: permissionOfRole,
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Xem chi tiết nhóm quyền thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [DELETE] admin/roles/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
  res.redirect("back");
};

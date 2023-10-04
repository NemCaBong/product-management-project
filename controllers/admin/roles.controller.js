const systemConfig = require("../../config/system");
const Role = require("../../models/role.model");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
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
      await Role.updateOne({ _id: id }, req.body);
      req.flash("success", "Cập nhật nhóm quyền thành công");
    }
    req.flash("error", "Không có dữ liệu để cập nhật");
  } catch (err) {
    req.flash("error", "Cập nhật nhóm quyền thất bại");
  }
  res.redirect("back");
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
    // console.log(req.body);
    if (permissions) {
      permissions.forEach(async (item) => {
        await Role.updateOne(
          { _id: item.id },
          { permissions: item.permissions }
        );
      });
    }
    req.flash("success", "Cập nhật phân quyền thành công");
  } catch (err) {
    req.flash("error", "Cập nhật phân quyền thất bại");
  }
  res.redirect(`back`);
};

const SettingsGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
  // lấy ra bản ghi đầu tiên trong collection.
  // và trong settingsGeneral cx chỉ có 1 bản ghi.
  const settingsGeneral = await SettingsGeneral.findOne({});

  res.render("admin/pages/settings/general.pug", {
    pageTitle: "Cài đặt chung",
    settingsGeneral: settingsGeneral,
  });
};

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingsGeneral = await SettingsGeneral.findOne({});

  // nếu đã có bản ghi trong collection thì chỉ cần update
  if (settingsGeneral) {
    await SettingsGeneral.updateOne({ _id: settingsGeneral.id }, req.body);
  } else {
    // nếu chưa có thì nghĩa là phải save vào.
    const record = new SettingsGeneral(req.body);
    await record.save();
  }

  res.redirect("back");
};

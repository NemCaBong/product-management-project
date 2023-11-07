const express = require("express");
const multer = require("multer");
const controller = require("../../controllers/admin/setting.controller");
const router = express.Router();
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// [GET] /admin/settings/general
router.get("/general", controller.general);

// [PATCH] /admin/settings/general
router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.generalPatch
);
module.exports = router;

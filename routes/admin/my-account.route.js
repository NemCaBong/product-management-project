const express = require("express");
const controller = require("../../controllers/admin/my-account.controller");
const multer = require("multer");
const router = express.Router();

const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// [GET] admin/my-account
router.get("/", controller.index);

// [GET] admin/my-account/edit
router.get("/edit", controller.edit);

// [PATCH] admin/my-account/edit
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router;

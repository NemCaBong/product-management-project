const express = require("express");
const controller = require("../../controllers/admin/account.controller");
const router = express.Router();
const validate = require("../../validates/admin/account.validate");

// multer
const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();
// end multer
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// [GET] admin/accounts
router.get("/", controller.index);

// [GET] admin/accounts/create
router.get("/create", controller.create);

// [POST] admin/accounts/create
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

// [GET] admin/accounts/edit/:id
router.get("/edit/:id", controller.edit);

// [PATCH] admin/accounts/edit/:id
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);

module.exports = router;

const express = require("express");
const controller = require("../../controllers/admin/product-category.controller");
const router = express.Router();
const validate = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
// multer
const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();
// end multer

router.get("/", controller.index);
router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.editCategory);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.delete);
module.exports = router;

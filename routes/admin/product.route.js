const express = require("express");
const controller = require("../../controllers/admin/product.controller");
const router = express.Router();
const validate = require("../../validates/admin/product.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// multer
const multer = require("multer");
// const storageMulter = require("../../helpers/storageMulter");
const upload = multer();
// end multer

router.get("/", controller.index);
// truyen data dong ":"
router.patch("/change-status/:status/:id", controller.changeStatus);

// update status all
router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);

// detail of product
router.get("/detail/:id", controller.detail);
// end detail

module.exports = router;

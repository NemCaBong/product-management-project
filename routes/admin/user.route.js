const express = require("express");
const controller = require("../../controllers/admin/user.controller");
const multer = require("multer");

const validate = require("../../validates/admin/user.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

const router = express.Router();
const upload = multer();

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.delete);

module.exports = router;

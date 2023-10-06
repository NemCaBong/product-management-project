const express = require("express");
const controller = require("../../controllers/admin/role.controller");
const router = express.Router();

// trang index
router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);
module.exports = router;

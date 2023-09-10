const express = require("express");
const controller = require("../../controllers/admin/product.controller");
const router = express.Router();

router.get("/", controller.index);
// truyen data dong ":"
router.patch("/change-status/:status/:id", controller.changeStatus);

module.exports = router;

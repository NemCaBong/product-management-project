const express = require("express");
const controller = require("../../controllers/admin/product.controller");
const router = express.Router();

router.get("/", controller.index);
// truyen data dong ":"
router.patch("/change-status/:status/:id", controller.changeStatus);

// update status all
router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);
module.exports = router;

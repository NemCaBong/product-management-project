const express = require("express");
const controller = require("../../controllers/client/cart.controller");
const router = express.Router();

// [GET] /cart
router.get("/", controller.index);

// [POST] /cart/add/:productID
router.post("/add/:productID", controller.addPost);

// [GET] /cart/deleted/:productID
router.get("/delete/:productID", controller.delete);

module.exports = router;

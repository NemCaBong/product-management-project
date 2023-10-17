const express = require("express");
const controller = require("../../controllers/client/cart.controller");
const router = express.Router();

router.post("/add/:productID", controller.addPost);

module.exports = router;

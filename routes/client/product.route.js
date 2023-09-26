const express = require("express");
const controller = require("../../controllers/client/product.controller");
const router = express.Router();

router.get("/", controller.index);

// detail of Item page
router.get("/:slug", controller.detail);
// end detail of item.

module.exports = router;

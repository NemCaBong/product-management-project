const express = require("express");
const controller = require("../../controllers/client/chat.controller");
const chatMiddleware = require("../../middlewares/client/chat.middleware");
const router = express.Router();

router.get("/:roomChatID", chatMiddleware.isAccepted, controller.index);

module.exports = router;

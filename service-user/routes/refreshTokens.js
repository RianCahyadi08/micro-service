const express = require("express");
const router = express.Router();

const refreshTokensHandler = require("./handler/refreshTokens");

router.post("/", refreshTokensHandler.create);

module.exports = router;

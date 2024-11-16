const express = require("express");
const router = express.Router();
const isBase64 = require("is-base64");
const base64Img = require("base64-img");

const { Media } = require("../models");

router.post("/", (req, res) => {
  const image = req.body.image;

  if (!isBase64(image, { mimeRequired: true })) {
    return res.status(400).json({
      status: "error",
      message: "Invalid base64 image format",
    });
  }

  base64Img.img(image, "./public/images/", Date.now(), async (err, filePath) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    const fileName = filePath.split("\\").pop().split("/").pop();

    const media = await Media.create({ image: `image/${fileName}` });

    return res.json({
      status: "success",
      message: "Image uploaded successfully",
      data: {
        id: media.id,
        image: `${req.get('host')}/images/${fileName}`,
      },
    });
  });
});

module.exports = router;

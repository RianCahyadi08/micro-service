const express = require("express");
const router = express.Router();
const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const { Media } = require("../models");
const fs = require("fs");

router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  Media.findAndCountAll({
    offset,
    limit,
  })
    .then((result) => {
      return res.json({
        status: "success",
        data: result.rows.map((media) => ({
          id: media.id,
          image: `${req.get("host")}/${media.image}`,
        })),
        totalPages: Math.ceil(result.count / limit),
        currentPage: page,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    });
});

router.post("/", (req, res) => {
  const image = req.body.image;

  if (!isBase64(image, { mimeRequired: true })) {
    return res.status(400).json({
      status: "error",
      message: "Invalid base64 image format",
    });
  }

  base64Img.img(
    image,
    "./public/images/",
    Date.now(),
    async (err, filePath) => {
      if (err) {
        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      }

      const fileName = filePath.split("\\").pop().split("/").pop();

      const media = await Media.create({ image: `images/${fileName}` });

      return res.json({
        status: "success",
        message: "Image uploaded successfully",
        data: {
          id: media.id,
          image: `${req.get("host")}/images/${fileName}`,
        },
      });
    }
  );
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const media = await Media.findByPk(id);

  if (!media) {
    return res.status(404).json({
      status: "error",
      message: "Media not found",
    });
  }

  fs.unlink(`./public/${media.image}`, async (err) => {
    if (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    await media.destroy();

    return res.json({
      status: "success",
      message: "Media deleted successfully",
    });
  });
});

module.exports = router;

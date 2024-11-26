const { RefreshToken } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const refreshToken = req.query.refresh_token;
    const token = await RefreshToken.findOne({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Refresh tokens retrieved successfully",
      data: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve refresh tokens",
    });
  }
};

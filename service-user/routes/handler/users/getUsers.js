const { User } = require("../../../models");

module.exports = async (req, res) => {
  try {
    const userIds = req.query.user_ids || [];

    const sqlOptions = {
      attributes: ["id", "name", "email", "role", "profession", "avatar"],
    };

    if (userIds.length > 0) {
      sqlOptions.where = {
        id: userIds,
      };
    }

    const users = await User.findAll(sqlOptions);
    return res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve users",
    });
  }
};

const bcrypt = require("bcrypt");
const { User } = require("../../../models");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = async (req, res) => {

    const schema = {
        name: "string|empty:false",
        email: "string|empty:false",
        password: "string|min:6",
        profession: "string|optional",
        avatar: "string|optional",
    }

    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "User not found",
        });
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json({
            status: "error",
            message: validate,
        });
    }

    const email = req.body.email;

    if (email) {
        const checkEmail = await User.findOne({
            where: {
                email,
            },
        });

        if (checkEmail && email !== user.email) {
            return res.status(409).json({
                status: "error",
                message: "Email is already existing",
            });
        }
    }

    const password = await bcrypt.hash(req.body.password, 10);

    const {
        name, profession, avatar
    } = req.body

    await user.update({
        email, password, name, profession, avatar
    });

    return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            profession: user.profession,
            avatar: user.avatar,
        }
    })

}
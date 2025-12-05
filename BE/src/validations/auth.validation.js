const Joi = require("joi");

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(50).required().messages({
        "string.alphanum": "Username chỉ được chứa chữ cái và số",
        "string.min": "Username phải có ít nhất 3 ký tự",
        "string.max": "Username không được vượt quá 50 ký tự",
        "any.required": "Username là bắt buộc",
    }),

    email: Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc",
    }),

    password: Joi.string()
        .min(6)
        .max(50)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
            "string.max": "Mật khẩu không được vượt quá 50 ký tự",
            "string.pattern.base":
                "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
            "any.required": "Mật khẩu là bắt buộc",
        }),

    confirm_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Mật khẩu xác nhận không khớp",
            "any.required": "Mật khẩu xác nhận là bắt buộc",
        }),

    full_name: Joi.string().min(2).max(100).optional().messages({
        "string.min": "Họ tên phải có ít nhất 2 ký tự",
        "string.max": "Họ tên không được vượt quá 100 ký tự",
    }),

    phone: Joi.string()
        .pattern(/^[0-9]{10,11}$/)
        .optional()
        .messages({
            "string.pattern.base": "Số điện thoại không hợp lệ (10-11 số)",
        }),
});

const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        "any.required": "Username là bắt buộc",
    }),

    password: Joi.string().required().messages({
        "any.required": "Mật khẩu là bắt buộc",
    }),
});

const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string().required().messages({
        "any.required": "Refresh token là bắt buộc",
    }),
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path[0],
                message: detail.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors,
            });
        }

        req.body = value;
        next();
    };
};

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    validate,
};

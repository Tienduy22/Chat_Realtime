const Joi = require("joi");

const groupConversationSchema = Joi.object({
    admin_id: Joi.number().integer().positive().required().messages({
        "number.base": "Admin ID phải là số",
        "number.integer": "Admin ID phải là số nguyên",
        "number.positive": "Admin ID phải là số dương",
        "any.required": "Admin ID là bắt buộc",
    }),

    member_ids: Joi.array()
        .items(Joi.number().integer().positive())
        .min(2)
        .max(255)
        .required()
        .messages({
            "array.base": "Danh sách thành viên phải là mảng",
            "array.min": "Nhóm phải có ít nhất 2 thành viên (ngoài admin)",
            "array.max": "Nhóm không được vượt quá 255 thành viên",
            "any.required": "Danh sách thành viên là bắt buộc",
        }),

    name: Joi.string().trim().min(3).max(100).required().messages({
        "string.empty": "Tên nhóm không được để trống",
        "string.min": "Tên nhóm phải có ít nhất 3 ký tự",
        "string.max": "Tên nhóm không được vượt quá 100 ký tự",
        "any.required": "Tên nhóm là bắt buộc",
    }),
});

const memberSchema = Joi.object({
    conversation_id: Joi.number().integer().positive().required().messages({
        "number.base": "Conversation ID phải là số",
        "number.integer": "Conversation ID phải là số nguyên",
        "number.positive": "Conversation ID phải là số dương",
        "any.required": "Conversation ID là bắt buộc",
    }),

    admin_id: Joi.number().integer().positive().required().messages({
        "number.base": "Admin ID phải là số",
        "number.integer": "Admin ID phải là số nguyên",
        "number.positive": "Admin ID phải là số dương",
        "any.required": "Admin ID là bắt buộc",
    }),

    member_id: Joi.number().integer().positive().required().messages({
        "number.base": "Member ID phải là số",
        "number.integer": "Member ID phải là số nguyên",
        "number.positive": "Member ID phải là số dương",
        "any.required": "Member ID là bắt buộc",
    }),
});

const changeNameSchema = Joi.object({
    conversation_id: Joi.number().integer().positive().required().messages({
        "number.base": "Conversation ID phải là số",
        "number.integer": "Conversation ID phải là số nguyên",
        "number.positive": "Conversation ID phải là số dương",
        "any.required": "Conversation ID là bắt buộc",
    }),

    admin_id: Joi.number().integer().positive().required().messages({
        "number.base": "Admin ID phải là số",
        "number.integer": "Admin ID phải là số nguyên",
        "number.positive": "Admin ID phải là số dương",
        "any.required": "Admin ID là bắt buộc",
    }),

    name: Joi.string().required().messages({
        "string.base": "name phải là string",
        "any.required": "Member ID là bắt buộc",
    }),
});

const changeAvatarSchema = Joi.object({
    conversation_id: Joi.number().integer().positive().required().messages({
        "number.base": "Conversation ID phải là số",
        "number.integer": "Conversation ID phải là số nguyên",
        "number.positive": "Conversation ID phải là số dương",
        "any.required": "Conversation ID là bắt buộc",
    }),

    admin_id: Joi.number().integer().positive().required().messages({
        "number.base": "Admin ID phải là số",
        "number.integer": "Admin ID phải là số nguyên",
        "number.positive": "Admin ID phải là số dương",
        "any.required": "Admin ID là bắt buộc",
    }),
});

const memberLeaveSchema = Joi.object({
    conversation_id: Joi.number().integer().positive().required().messages({
        "number.base": "Conversation ID phải là số",
        "number.integer": "Conversation ID phải là số nguyên",
        "number.positive": "Conversation ID phải là số dương",
        "any.required": "Conversation ID là bắt buộc",
    }),

    member_id: Joi.number().integer().positive().required().messages({
        "number.base": "Member ID phải là số",
        "number.integer": "Member ID phải là số nguyên",
        "number.positive": "Member ID phải là số dương",
        "any.required": "Member ID là bắt buộc",
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
    groupConversationSchema,
    memberSchema,
    memberLeaveSchema,
    changeNameSchema,
    changeAvatarSchema,
    validate,
};

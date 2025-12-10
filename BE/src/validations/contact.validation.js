const Joi = require("joi");

const contactInvitationsSchema = Joi.object({
    user_id: Joi.number().required().messages({
        "any.required": "user_id là bắt buộc",
    }),

    contact_user_id: Joi.number().required().messages({
        "any.required": "contact_user_id là bắt buộc",
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
    contactInvitationsSchema,
    validate,
};

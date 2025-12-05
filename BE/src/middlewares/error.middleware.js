const handleError = (err, req, res, next) => {
    // Log error
    console.error("Error:", err);

    // Lỗi có statusCode (custom error)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // Sequelize validation error
    if (err.name === "SequelizeValidationError") {
        const errors = err.errors.map((e) => ({
            field: e.path,
            message: e.message,
        }));

        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors,
        });
    }

    // Sequelize unique constraint error
    if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
            success: false,
            message: "Dữ liệu đã tồn tại",
            errors: err.errors.map((e) => ({
                field: e.path,
                message: `${e.path} đã được sử dụng`,
            })),
        });
    }

    // Lỗi mặc định
    return res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Đã có lỗi xảy ra, vui lòng thử lại sau",
    });
};

const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} không tồn tại`,
    });
};

module.exports = {
    handleError,
    notFound,
};

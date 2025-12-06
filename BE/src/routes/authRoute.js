const express = require("express");
const authController = require("../controllers/auth.controller");
const {
    validate,
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} = require("../validations/auth.validation");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", validate(loginSchema), authController.login);

router.post(
    "/refresh_token",
    validate(refreshTokenSchema),
    authController.refreshToken
);

router.get("/profile", authenticate, authController.profile);

router.post("/logout", authenticate, authController.logout);

module.exports = router;

const express = require("express")
const cookieParser = require("cookie-parser")
const Auth = require("../controllers/auth.controllers");
const { verifyToken } = require("../middleware/verifyToken.js")

const Router = express.Router()
Router.use(cookieParser());


Router.get("/check-auth", verifyToken, Auth.checkAuth);

Router.post("/signup", Auth.signup)

Router.post("/login", Auth.login)

Router.post("/logout", Auth.logout)

Router.post("/verify-email", Auth.verifyEmail)

Router.post("/forgot-password", Auth.forgotPassword)

Router.post("/reset-password/:token", Auth.resetPassword)

module.exports = Router
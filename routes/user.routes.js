import express from "express";
import {registerUser, varifyUser ,login, logout, getProfile, forgetPassword, resetPasswordvarify, resetPass, getDetail} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.get("/varify/:token", varifyUser);

router.post("/login", login);

router.post("/forget",forgetPassword);

router.get("/reset/:token",resetPasswordvarify);

router.get("/logout",isLoggedIn, logout);  // here isLoggedIn is injected middleware

router.get("/profile",isLoggedIn, getProfile);

router.post("/resetpass",resetPass)

router.get("/detail",getDetail)


export default router;
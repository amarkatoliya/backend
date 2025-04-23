import express from "express";

import {registerUser, varifyUser ,login, logout} from "../controller/user.controller.js";

import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.get("/varify/:token", varifyUser);

router.post("/login", login);


router.get("/logout",isLoggedIn, logout);  // here isLoggedIn is injected middleware


export default router;
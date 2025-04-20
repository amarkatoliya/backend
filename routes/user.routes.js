import express from "express"

import {registerUser, varifyUser ,login} from "../controller/user.controller.js"

const router = express.Router();

router.post("/register", registerUser);

router.get("/varify/:token", varifyUser);

router.post("/login", login);

export default router;
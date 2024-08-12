import { Router } from "express";
import { registerrUser } from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerrUser)


export default router;
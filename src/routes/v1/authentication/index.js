import { Router } from "express";
import LoginApi from "./login/login.api.js";

const router = Router();

router.use("/login", LoginApi);

export default router;

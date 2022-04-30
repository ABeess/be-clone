import { Router } from "express";
import AuthenticationService from "./authentication/index.js";

const router = Router();

router.use("/authentication", AuthenticationService);

export default router;

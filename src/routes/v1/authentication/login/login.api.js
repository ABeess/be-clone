import { Router } from "express";

const routes = Router();

routes.get("/test", (req, res) => {
  res.json({ t: 1 });
});

routes.post("/", async (req, res) => {
  res.json({ status: true, message: "Login done!" });
});

export default routes;

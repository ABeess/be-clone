import { Router } from "express";

const routes = Router();

routes.get("/test", (req, res) => {
  res.json({ t: 1 });
});

export default routes;

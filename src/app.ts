import express from "express";
export type { Request, Response } from "express";
import router from "./routes/pontos-routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
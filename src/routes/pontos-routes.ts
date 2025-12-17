import express from "express";
import * as PontoController from "../controllers/pontos-coleta-controller.js";

const router = express.Router();

router.post('/pontos', PontoController.criarPonto);
router.get('/pontos', PontoController.listarPontos);
router.put("/pontos/:id", PontoController.atualizarPonto);
router.delete("/pontos/:id", PontoController.deletarPonto);


export default router;
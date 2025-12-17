import db from "../database/database.js";
import { atualizarPontoSchema, criarPontoSchema, deletarPontoSchema, listarPontosSchema } from "../validators/pontos-validator.js";
export const criarPonto = (req, res) => {
    try {
        const dadosValidados = criarPontoSchema.parse(req.body);
        const pontoCriado = db.insert(dadosValidados);
        return res.status(201).json({
            mensagem: "Ponto criado com sucesso",
            data: pontoCriado
        });
    }
    catch (error) {
        return res.status(500).json({
            erro: "Erro ao cadastrar ponto",
            detalhes: error instanceof Error ? error.message : error,
        });
    }
};
const KEYS = ["limit", "skip", "orderBy", "order"];
export const listarPontos = (req, res) => {
    try {
        const options = {
            filters: {},
        };
        const parsedQuery = listarPontosSchema.parse(req.query);
        // 🔍 separa filtros dinâmicos
        Object.entries(parsedQuery).forEach(([key, value]) => {
            if (KEYS.includes(key))
                return;
            const numericValue = Number(value);
            options.filters[key] = isNaN(numericValue)
                ? value
                : numericValue;
        });
        // 🔃 ordenação
        if (parsedQuery.orderBy) {
            options.sort = {
                [String(parsedQuery.orderBy)]: String(parsedQuery.order).toUpperCase() === "DESC"
                    ? "DESC"
                    : "ASC"
            };
        }
        // 📄 paginação
        if (parsedQuery.limit) {
            options.limit = Number(parsedQuery.limit);
        }
        if (parsedQuery.skip) {
            options.skip = Number(parsedQuery.skip);
        }
        const pontos = db.list(options);
        return res.status(200).json({
            total: pontos.length,
            data: pontos
        });
    }
    catch (error) {
        return res.status(500).json({
            erro: "Erro ao listar pontos",
            detalhes: error
        });
    }
};
export const atualizarPonto = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "ID do ponto é obrigatório",
            });
        }
        const dadosValidados = atualizarPontoSchema.parse(req.body);
        const pontoAtualizado = db.update(id, dadosValidados);
        if (!pontoAtualizado) {
            return res.status(404).json({
                message: "Ponto não encontrado",
            });
        }
        return res.status(200).json(pontoAtualizado);
    }
    catch (error) {
        return res.status(400).json({
            message: "Erro ao atualizar ponto",
            error: error?.errors ?? error?.message,
        });
    }
};
export const deletarPonto = (req, res) => {
    try {
        const { id } = deletarPontoSchema.parse(req.params);
        const resultado = db.delete(id);
        if (resultado.changes === 0) {
            return res.status(404).json({
                message: "Ponto não encontrado",
            });
        }
        return res.status(200).json({
            message: "Ponto deletado com sucesso",
            ...resultado,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Erro ao deletar ponto",
            error: error?.errors ?? error?.message,
        });
    }
};

import { z } from "zod";
export const criarPontoSchema = z.object({
    tipo_ponto: z
        .string({ error: "tipo_ponto é obrigatório" })
        .min(1, "tipo_ponto não pode ser vazio"),
    latitude: z
        .number({ error: "latitude é obrigatória" })
        .min(-90, "latitude inválida")
        .max(90, "latitude inválida"),
    longitude: z
        .number({ error: "longitude é obrigatória" })
        .min(-180, "longitude inválida")
        .max(180, "longitude inválida"),
    altitude: z
        .number()
        .optional(),
    data_coleta: z
        .string(),
    ph: z
        .number()
        .min(0, "ph mínimo é 0")
        .max(14, "ph máximo é 14"),
    turbidez: z
        .number()
        .min(0, "turbidez não pode ser negativa"),
    temperatura: z
        .number(),
    condicoes_entorno: z
        .string(),
    observacoes: z
        .string()
        .optional(),
});
export const listarPontosSchema = z
    .object({
    limit: z
        .string()
        .transform(Number)
        .refine(n => n > 0 && n <= 100)
        .optional(),
    skip: z
        .string()
        .transform(Number)
        .refine(n => n >= 0)
        .optional(),
    orderBy: z
        .string()
        .optional(),
    order: z
        .enum(["ASC", "DESC"])
        .optional(),
})
    .catchall(z.union([
    z.string(),
    z.number(),
]));
export const atualizarPontoSchema = z.object({
    tipo_ponto: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    altitude: z.number().optional(),
    data_coleta: z.string().optional(),
    ph: z.number().min(0).max(14).optional(),
    turbidez: z.number().optional(),
    temperatura: z.number().optional(),
    condicoes_entorno: z.string().optional(),
    observacoes: z.string().optional(),
});
export const deletarPontoSchema = z.object({
    id: z.string().uuid("ID inválido"),
});

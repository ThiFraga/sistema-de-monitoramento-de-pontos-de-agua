import Database from "better-sqlite3";
import { randomUUID } from "crypto";
const database = new Database("database.sqlite");
database.pragma("journal_mode = WAL");
class PontosDB {
    constructor() {
        this.insert = database.transaction((doc) => {
            const query = this.insertSQL();
            doc.id = randomUUID();
            query.run(doc);
        });
        this.update = database.transaction((id, doc) => {
            const fields = Object.keys(doc);
            if (fields.length === 0) {
                return { changes: 0 };
            }
            const setClause = fields
                .map(field => `${field} = @${field}`)
                .join(", ");
            const query = database.prepare(`
            UPDATE pontos_coleta
            SET ${setClause}
            WHERE id = @id
        `);
            const result = query.run({
                id,
                ...doc,
            });
            return {
                changes: result.changes,
            };
        });
        this.delete = database.transaction((id) => {
            const query = database.prepare(`
            DELETE FROM pontos_coleta
            WHERE id = ?
        `);
            const result = query.run(id);
            return {
                changes: result.changes,
            };
        });
        try {
            const createTable = `
                CREATE TABLE IF NOT EXISTS pontos_coleta (
                    id TEXT PRIMARY KEY,
                    tipo_ponto TEXT NOT NULL,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    altitude REAL,
                    data_coleta DATETIME NOT NULL,
                    
                    ph REAL CHECK (ph BETWEEN 0 AND 14),
                    turbidez REAL,
                    temperatura REAL,
                    condicoes_entorno TEXT,
                    observacoes TEXT,
                    UNIQUE (latitude, longitude)
                )
            `; //responsavel TEXT,
            database.exec(createTable);
            console.log('Tabela "pontos_coleta" criada com sucesso ou já existente.');
        }
        catch (err) {
            if (err instanceof Error) {
                console.error('Erro ao criar a tabela:', err.message);
            }
            else {
                console.error('Erro desconhecido:', err);
            }
        }
        finally {
        }
    }
    insertSQL() {
        return database.prepare(`
            INSERT INTO pontos_coleta (
                id,
                tipo_ponto,
                latitude,
                longitude,
                altitude,
                data_coleta,
                ph,
                turbidez,
                temperatura,
                condicoes_entorno,
                observacoes
            ) VALUES (
                @id,
                @tipo_ponto,
                @latitude,
                @longitude,
                @altitude,
                @data_coleta,
                @ph,
                @turbidez,
                @temperatura,
                @condicoes_entorno,
                @observacoes
            )
        `);
    }
    list(options) {
        const params = [];
        let query = "SELECT * FROM pontos_coleta WHERE 1 = 1";
        if (!!options.filters) {
            Object.keys(options.filters).map((key) => {
                query += ` AND ${key} = ?`;
                params.push(options.filters[key]);
            });
        }
        if (!!options.sort) {
            Object.keys(options.sort).map((key) => {
                query += ` ORDER BY ${key} ${options.sort[key]}`;
            });
        }
        if (options.limit) {
            query += ` LIMIT ?`;
            params.push(options.limit);
        }
        if (options.skip) {
            query += ` OFFSET ?`;
            params.push(options.skip);
        }
        const sql = database.prepare(query);
        return sql.all(params);
    }
}
const Pontos = new PontosDB();
export default Pontos;

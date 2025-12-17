# 📌 Sistema de Pontos de Coleta – API + CLI

Este projeto implementa um **sistema completo de gerenciamento de pontos de coleta ambiental**, composto por:

* 🌐 **API REST** (Express + SQLite)
* 🖥️ **CLI em Node.js (TypeScript)** para operação via terminal
* 🗄️ **Banco de dados SQLite** usando `better-sqlite3`

O objetivo é permitir **criar, listar, filtrar, atualizar e deletar pontos de coleta**, tanto via API quanto via linha de comando.

---

## 🧱 Tecnologias utilizadas

* **Node.js 20+**
* **TypeScript**
* **Express** (API REST)
* **SQLite** (`better-sqlite3`)
* **Zod** (validação de dados)
* **ESM / NodeNext**

---

## 📂 Estrutura do projeto

```text
backend/
├─ client/           # CLI compilado
├─ src/
│  ├─ cli/
│  ├─ controllers/
│  ├─ routes/
│  ├─ database/
│  ├─ validators/
│  ├─ Interface/
│  ├─ utils/
│  └─ app.ts
├─ database.sqlite
├─ database.sqlite-shm
├─ database.sqlite-wal
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## 🗄️ Modelo de dados – `pontos_coleta`

Campos principais:

| Campo               | Tipo          | Descrição                      |
| ------------------- | ------------- | ------------------------------ |
| `id`                | string (UUID) | Identificador único            |
| `tipo_ponto`        | string        | Tipo do ponto (Rio, Lago, etc) |
| `latitude`          | number        | Latitude                       |
| `longitude`         | number        | Longitude                      |
| `altitude`          | number        | Altitude                       |
| `data_coleta`       | string        | Data da coleta                 |
| `ph`                | number        | pH da água                     |
| `turbidez`          | number        | Turbidez                       |
| `temperatura`       | number        | Temperatura                    |
| `condicoes_entorno` | string        | Condições ambientais           |
| `observacoes`       | string        | Observações adicionais         |

---

## 🌐 API REST

### ▶️ Criar ponto

`POST /pontos`

```json
{
  "tipo_ponto": "Rio",
  "latitude": -23.55,
  "longitude": -46.63,
  "data_coleta": "2025-12-17",
  "ph": 7.2
}
```

---

### ▶️ Listar pontos (com filtros)

`GET /pontos`

Parâmetros suportados:

* filtros dinâmicos (`tipo_ponto=Rio`)
* `limit`
* `skip`
* `orderBy`
* `order`

Exemplo:

```
GET /pontos?tipo_ponto=Rio&orderBy=ph&order=DESC
```

---

### ▶️ Atualizar ponto

`PUT /pontos/:id`

```json
{
  "ph": 7.6,
  "observacoes": "Nova medição"
}
```

---

### ▶️ Deletar ponto

`DELETE /pontos/:id`

---

## 🖥️ CLI – Interface de Linha de Comando

O CLI permite executar **as mesmas operações da API**, diretamente pelo terminal.

### ▶️ Executar o CLI

```bash
npm run cli
```

---

### 📋 Funcionalidades do CLI

#### 1️⃣ Criar ponto

* Solicita todos os campos via terminal
* Salva diretamente no banco

#### 2️⃣ Listar pontos

* Filtros dinâmicos por qualquer campo
* Ordenação (ASC / DESC)
* Paginação (`limit` e `offset`)
* Saída em **JSON**

Exemplo de saída:

```json
{
  "total": 2,
  "data": [ { "tipo_ponto": "Rio", "ph": 7.6 } ]
}
```

#### 3️⃣ Atualizar ponto

* Atualiza qualquer campo dinamicamente
* Baseado no `id`

#### 4️⃣ Deletar ponto

* Remove um ponto pelo `id`

---

## 🛠️ Scripts disponíveis

```json
{
  "scripts": {
    "build:cli": "tsc -p tsconfig.cli.json",
    "cli": "node client/cli/cli.js",
    "server": "node dist/server.js"
  }
}
```

---

## 🧪 Fluxo recomendado

```bash
# Instalar dependências
npm install

# Compilar o CLI
npm run build:cli

# Executar o CLI
npm run cli

# OU executar a API
npm run server
```



# 📌 Sistema de Pontos de Coleta – API + CLI

Este projeto implementa um **sistema completo de gerenciamento de pontos de coleta ambiental**, composto por:

* 🌐 **API REST** (Express + SQLite)
* 🖥️ **CLI em Node.js (TypeScript)** para operação via terminal
* 🗄️ **Banco de dados SQLite** usando `better-sqlite3`

O objetivo é permitir **criar, listar, filtrar, atualizar e deletar pontos de coleta**, tanto via API quanto via linha de comando.

---

## 🧱 Tecnologias utilizadas

* **Node.js 20+** (obrigatório)

* **npm 9+**

* Sistema operacional: Windows, Linux ou macOS

* **Node.js 20+**

* **TypeScript**

* **Express** (API REST)

* **SQLite** (`better-sqlite3`)

* **Zod** (validação de dados)

* **ESM / NodeNext**

---

## 📥 Instalação

### 🔹 Requisitos

Antes de iniciar, verifique se você possui instalado:

* **Node.js 20 ou superior**
* **npm** (geralmente instalado junto com o Node)

Para verificar:

```bash
node -v
npm -v
```

---

### 🔹 Instalação das dependências

Na raiz do projeto, execute:

```bash
npm install
```

Esse comando instalará todas as dependências necessárias para rodar a **API** e o **CLI**.

---

## 📂 Estrutura do projeto

```text
src/
 ├─ cli/
 │   └─ cli.ts              # Interface de linha de comando
 ├─ controllers/
 │   └─ pontos.controller.ts # Controllers da API
 ├─ database/
 │   └─ database.ts         # Camada de acesso ao banco (CRUD)
 ├─ validators/
 │   └─ pontos.validator.ts # Schemas Zod
 ├─ Interface/
 │   └─ pontos-interface.ts # Tipagens (IPontos)
 └─ server.ts               # Inicialização do servidor Express

client/
 └─ cli/
     └─ cli.js               # CLI compilado

package.json
tsconfig.json
tsconfig.cli.json
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
# Compilar CLI
npm run build:cli

# Executar CLI
npm run cli

# Compilar server
npm run build

# Executar API
npm run server
```

---

## 🧪 Exemplos de comandos (Windows CMD)

> ⚠️ Antes de executar os comandos abaixo, certifique-se de que a API esteja rodando:
>
> ```bat
> npm run server
> ```

Todos os exemplos abaixo estão **em uma única linha**, prontos para **copiar e colar no CMD do Windows**.

---

### ➕ Criar um ponto (CREATE)

Cria um novo ponto de coleta no banco de dados.

```bat
curl -X POST http://localhost:3000/pontos -H "Content-Type: application/json" -d "{\"tipo_ponto\":\"Rio\",\"latitude\":-23.55,\"longitude\":-46.63,\"altitude\":760,\"data_coleta\":\"2025-12-17\",\"ph\":7.2,\"turbidez\":3.1,\"temperatura\":22.5,\"condicoes_entorno\":\"Vegetação preservada\",\"observacoes\":\"Coleta realizada em período seco\"}"

```

---

### 📋 Listar todos os pontos (LIST)

Retorna todos os pontos cadastrados.

```bat
curl http://localhost:3000/pontos
```

---

### 🔍 Listar pontos filtrando por tipo

Retorna apenas pontos do tipo informado.

```bat
curl "http://localhost:3000/pontos?tipo_ponto=Rio"
```

---

### 🔽 Listar pontos ordenados por pH (ordem decrescente)

```bat
curl "http://localhost:3000/pontos?orderBy=ph&order=DESC"
```

---

### 📄 Listar pontos com paginação

Retorna 2 registros, ignorando o primeiro.

```bat
curl "http://localhost:3000/pontos?limit=2&skip=1"
```

---

### 🔎 Listar pontos com filtro + ordenação + paginação

Exemplo completo usando múltiplos parâmetros.

```bat
curl "http://localhost:3000/pontos?tipo_ponto=Rio&orderBy=ph&order=ASC&limit=5"
```

---

### ✏️ Atualizar um ponto (UPDATE)

Atualiza campos específicos de um ponto existente (substitua o ID por um válido).

```bat
curl -X PUT http://localhost:3000/pontos/bffe4c83-b9cf-4085-b663-e10f9c0f40ea -H "Content-Type: application/json" -d "{\"ph\":7.6,\"observacoes\":\"Nova medição após análise\"}"
```

---

### 🗑️ Deletar um ponto (DELETE)

Remove um ponto do banco de dados pelo ID.

```bat
curl -X DELETE http://localhost:3000/pontos/bffe4c83-b9cf-4085-b663-e10f9c0f40ea
```

---

### 📝 Observações

* Todos os comandos retornam respostas em **JSON**
* Os exemplos são compatíveis com **CMD do Windows**
* Substitua os IDs conforme os dados existentes no banco
* Os parâmetros de filtro são dinâmicos e dependem dos campos da tabela

import readline from "readline";
import Pontos from "../database/database.js";
import type { IPontos } from "../Interface/pontos-interface.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function criarPonto() {
  const ponto: IPontos = {
    tipo_ponto: await ask("Tipo do ponto: "),
    latitude: Number(await ask("Latitude: ")),
    longitude: Number(await ask("Longitude: ")),
    altitude: Number(await ask("Altitude: ")),
    data_coleta: await ask("Data da coleta (YYYY-MM-DD): "),
    ph: Number(await ask("pH: ")),
    turbidez: Number(await ask("Turbidez: ")),
    temperatura: Number(await ask("Temperatura: ")),
    condicoes_entorno: await ask("Condições do entorno: "),
    observacoes: await ask("Observações: "),
  } as IPontos;

  Pontos.insert(ponto);
  console.log("\n✔ Ponto criado com sucesso!\n");
}

async function listarPontos() {
  const options: any = {
    filters: {},
  };

  const usarFiltro = (await ask("Deseja aplicar filtros? (s/n): ")).toLowerCase();

  if (usarFiltro === "s") {
    while (true) {
      const campo = await ask("Campo para filtrar (ENTER para sair): ");

      if (!campo) break;

      const valor = await ask(`Valor para ${campo}: `);

      const numericValue = Number(valor);

      options.filters[campo] = isNaN(numericValue) ? valor : numericValue;
    }
  }

  const ordenar = (await ask("Deseja ordenar? (s/n): ")).toLowerCase();

  if (ordenar === "s") {
    const orderBy = await ask("Campo para ordenar: ");
    const order = await ask("ASC ou DESC (padrão ASC): ");

    options.sort = {
      [orderBy]: order.toUpperCase() === "DESC" ? "DESC" : "ASC",
    };
  }

  const limit = await ask("Limite de registros (ENTER para ignorar): ");
  if (limit) options.limit = Number(limit);

  const skip = await ask("Offset (ENTER para ignorar): ");
  if (skip) options.skip = Number(skip);

  const pontos = Pontos.list(options);

  console.table(pontos);
}

async function atualizarPonto() {
  const id = await ask("ID do ponto: ");
  const campo = await ask("Campo para atualizar: ");
  const valor = await ask("Novo valor: ");

  const payload: Record<string, any> = {
    [campo]: isNaN(Number(valor)) ? valor : Number(valor),
  };

  const result = Pontos.update(id, payload);

  console.log(`\n✔ Registros alterados: ${result.changes}\n`);
}

async function deletarPonto() {
  const id = await ask("ID do ponto para deletar: ");
  const result = Pontos.delete(id);
  console.log(`\n✔ Registros removidos: ${result.changes}\n`);
}

async function menu() {
  while (true) {
    console.log("\n📌 CLI – Pontos de Coleta");
    console.log("1 - Criar ponto");
    console.log("2 - Listar pontos");
    console.log("3 - Atualizar ponto");
    console.log("4 - Deletar ponto");
    console.log("0 - Sair");

    const opcao = await ask("Escolha uma opção: ");

    switch (opcao) {
      case "1":
        await criarPonto();
        break;
      case "2":
        await listarPontos();
        break;
      case "3":
        await atualizarPonto();
        break;
      case "4":
        await deletarPonto();
        break;
      case "0":
        rl.close();
        process.exit(0);
      default:
        console.log("❌ Opção inválida");
    }
  }
}

menu();
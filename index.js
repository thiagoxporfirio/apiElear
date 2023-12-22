const axios = require("axios");

let access_token = "YYAE2Lr7YvdWe36zAzz7IwnR7097vt87";
const refresh_token = "q3YJHscbwCKoD3O1rIcMnkwMtqkuy2hX";

const client_id = "2nkynyo1lXuHUN9pLZqiqvGS0XTONlCn";
const client_secret = "a8bjnGVvDnM0RK8UJIEHKsg7n3A9AbHp";

let ultimoPedidoArmazenado = null;

async function obterNovoAccessToken() {
  try {
    const response = await axios.post(
      "https://api.tagplus.com.br/oauth2/token",
      {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_secret,
      }
    );

    access_token = response.data.access_token;
    refresh_token = response.data.refresh_token; // Atualiza o refresh_token
    console.log("Novo Access Token obtido:", access_token);
    console.log("Novo Refresh Token obtido:", refresh_token);
  } catch (error) {
    console.error("Erro ao obter novo Access Token:", error.message);
  }
}

async function fazerRequisicoes() {
  try {
    // Verificar se o token ainda é válido
    if (!access_token) {
      await obterNovoAccessToken();
    }

    const dataDeHoje = new Date().toISOString().split("T")[0];
    // Fazer a primeira requisição para o servidor inicial
    const respostaServidor1 = await axios.get(
      `https://api.tagplus.com.br/pedidos?status=B&data_criacao=${dataDeHoje}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "X-Api-Version": "2.0",
          "Content-Type": "application/json",
        },
      }
    );
    // Extrair os dados da resposta, se necessário
    const pedidos = respostaServidor1.data;
    if (pedidos.length > 0) {
      // Obter o último item da lista
      const ultimoPedidoAtual = pedidos[pedidos.length - 1];
      // Comparar com o último armazenado
      if (
        !ultimoPedidoArmazenado ||
        ultimoPedidoAtual.id !== ultimoPedidoArmazenado.id
      ) {
        console.log(
          "Houve uma alteração no último pedido. Atualizando variável."
        );
        ultimoPedidoArmazenado = ultimoPedidoAtual;
        // await gerarPedidoEntrega(ultimoPedidoAtual);
      } else {
        console.log("Retorna o ultimo item, se for o mesmo: ", ultimoPedidoAtual)
      }
    }

  } catch (erro) {
    console.error("Ocorreu um erro:", erro);

    // Se o erro estiver relacionado à autenticação, tente obter um novo token e refaça a requisição
    if (erro.response && erro.response.status === 401) {
      await obterNovoAccessToken();
    }
  }
}

// async function gerarPedidoEntrega(ultimoPedido) {
//   // Lógica para fazer a requisição para gerar um pedido de entrega no outro servidor
//   try {
//     const respostaPedidoEntrega = await axios.post(
//       "URL_SERVIDOR_ENTREGA",
//       {
//         dados: ultimoPedido,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "X-Api-Version": "2.0",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log(
//       "Pedido de entrega gerado com sucesso:",
//       respostaPedidoEntrega.data
//     );
//   } catch (error) {
//     console.error("Erro ao gerar pedido de entrega:", error.message);
//   }
// }

setInterval(fazerRequisicoes, 10 * 1000);

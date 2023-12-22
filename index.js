const axios = require("axios");

let access_token = "838yPlWznA7JLHi0GWUbx0NYWIl0VrlR";
const refresh_token = "rPCrdCLA2A7YfrJQSLGiYsjeDsSV0hQO";

const client_id = "2nkynyo1lXuHUN9pLZqiqvGS0XTONlCn";
const client_secret = "a8bjnGVvDnM0RK8UJIEHKsg7n3A9AbHp";

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
    console.log("Novo Access Token obtido:", access_token);
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

    // Fazer a primeira requisição para o servidor inicial
    const respostaServidor1 = await axios.get("https://api.tagplus.com.br/pedidos?status=B", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "X-Api-Version": "2.0",
        "Content-Type": "application/json",
      },
    });

    // Extrair os dados da resposta, se necessário
    const dadosResposta1 = respostaServidor1.data;

    // // Fazer a segunda requisição para o segundo servidor com os dados da primeira resposta
    // const respostaServidor2 = await axios.post(
    //   "URL_SERVIDOR_2",
    //   { dados: dadosResposta1 },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`,
    //       "X-Api-Version": "2.0",
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // Processar a resposta final, se necessário
    // const resultadoFinal = respostaServidor2.data;

    console.log("Resultado Final:", dadosResposta1);
  } catch (erro) {
    console.error("Ocorreu um erro:", erro);

    // Se o erro estiver relacionado à autenticação, tente obter um novo token e refaça a requisição
    if (erro.response && erro.response.status === 401) {
      await obterNovoAccessToken();
    }
  }
}

// setInterval(fazerRequisicoes, 10 * 1000);

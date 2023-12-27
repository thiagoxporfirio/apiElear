const axios = require("axios");
const cron = require("node-cron");

let access_token = "K96hroxEgXQAUcH0WF5FTLQQrMqWCy79";
let refresh_token = "66qnHmzVi2PcFonmS0D6WYMtqfswqKkJ";
let ultimoPedidoArmazenado = null;
let tokenExpiryTime = null;

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
    refresh_token = response.data.refresh_token;
    tokenExpiryTime = new Date().getTime() + response.data.expires_in * 1000;

    console.log("Novo Access Token obtido:", access_token);
    console.log("Novo Refresh Token obtido:", refresh_token);
  } catch (error) {
    console.error("Erro ao obter novo Access Token:", error.message);
  }
}

async function obterDetalhesCliente(clienteId) {
  try {
    const respostaDetalhesCliente = await axios.get(
      `https://api.tagplus.com.br/clientes/${clienteId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "X-Api-Version": "2.0",
          "Content-Type": "application/json",
        },
      }
    );

    return respostaDetalhesCliente.data;
  } catch (error) {
    console.error("Erro ao obter detalhes do cliente:", error.message);
    throw error;
  }
}

async function verificarTokenExpirado() {
  return tokenExpiryTime && tokenExpiryTime < new Date().getTime();
}

async function FormatarDados(detalhesCliente) {
  try {
    console.log(detalhesCliente);
    if (typeof detalhesCliente !== "object" || detalhesCliente === null) {
      throw new Error("O parâmetro 'detalhesCliente' não é um objeto válido.");
    }
    // Mapear os dados para o formato desejado
    const hoje = new Date();
    const dataDeHoje = hoje.toISOString().split("T")[0];
    const enderecoCompleto = `${ultimoPedidoArmazenado.enderecos[0].logradouro}, ${ultimoPedidoArmazenado.enderecos[0].numero}, ${ultimoPedidoArmazenado.enderecos[0].complemento}`;
    const dadosFormatados = {
      Driver: {
        PhoneCountry: "55",
        PhoneNumber: "21970188673",
        DefineDriverAfter: 0,
      },
      SendToDriver: true,
      Customer: {
        DocumentType: ultimoPedidoArmazenado.cpf ? "CPF" : "CNPJ",
        DocumentNumber:
          ultimoPedidoArmazenado.cpf || ultimoPedidoArmazenado.cnpj,
      },
      OrderType: 1,
      OrderID: `ID${ultimoPedidoArmazenado.ultimoPedido.id}`,
      OrderNumber: ultimoPedidoArmazenado.ultimoPedido.numero.toString(),
      OrderDescription: "CT-e",
      OrderDescriptionDocuments: "NF-e",
      SourceAddress: {
        Address: "Av. Cesário de Melo, 4654",
        AdditionalInformation: "Campo Grande",
        Address2: "Campo Grande",
        ZipCode: "23055-001",
        City: "Rio de Janeiro",
        State: "RJ",
        Country: "Brasil",
        Name: "Nome do cliente.",
        Responsibility: "ELEAR Distribuidora",
        PhoneCountry: "+55",
        PhoneNumber: "2134354735",
        Email: "eleardistribuidora@gmail.com",
        DocumentType: "CNPJ",
        DocumentNumber: "26161366000217",
        PhoneCountrySms: "+55",
        PhoneNumberSms: "2134354735",
      },
      DestinationAddress: {
        Address: enderecoCompleto,
        AdditionalInformation: ultimoPedidoArmazenado.enderecos[0].complemento,
        Address2: ultimoPedidoArmazenado.enderecos[0].bairro,
        ZipCode: ultimoPedidoArmazenado.enderecos[0].cep,
        City: ultimoPedidoArmazenado.enderecos[0].cidade.nome,
        State: "RJ",
        Country: "Brasil",
        Name: ultimoPedidoArmazenado.razao_social,
        Responsibility: ultimoPedidoArmazenado.razao_social,
        PhoneCountry: "+55",
        PhoneNumber: ultimoPedidoArmazenado.telefone,
        Email: ultimoPedidoArmazenado.telefone,
        DocumentType: ultimoPedidoArmazenado.cpf ? "CPF" : "CNPJ",
        DocumentNumber:
          ultimoPedidoArmazenado.cpf || ultimoPedidoArmazenado.cnpj,
        PhoneCountrySms: "+55",
        PhoneNumberSms: ultimoPedidoArmazenado.telefone,
      },
      Documents: [
        {
          DocumentID: `ID${ultimoPedidoArmazenado.ultimoPedido.id}`,
          DocumentNumber: ultimoPedidoArmazenado.ultimoPedido.numero.toString(),
          DocumentDescription: "NF-e",
          Volumes: [
            {
              VolumeID: `ID${ultimoPedidoArmazenado.ultimoPedido.id}`,
              Count: 10,
              Unity: "PCT",
              Description: "Documento xxxx",
              BarCode: "99999999999999999999",
              Read: 9,
            },
          ],
        },
      ],
      Observation: "Observação da Entrega para liberação.",
      DepartureDate: dataDeHoje,
      DeliveryDate: dataDeHoje,
      DeliveryStartTime: "23:59",
      DeliveryEndTime: "23:59",
      CollectDate: dataDeHoje,
      CollectStartTime: "23:59",
      CollectEndTime: "23:59",
      Sequence: 2,
      Volume: 10,
      Weight: 10,
      LoadSeparation_RouteName: "Carga Exemplo",
    };

    // Enviar os dados formatados
    console.log("Enviando dados formatados para a funcao: ");
    await postTudoEntrege(dadosFormatados);
  } catch (error) {
    console.error("Erro ao enviar dados formatados:", error.message);
  }
}

async function postTudoEntrege(dadosFormatados) {
  try {
    const requesterKey = "SUA_CHAVE_AQUI";
    const response = await axios.post(
      "https://api.tudoentregue.com.br/v1/orders",
      dadosFormatados,
      {
        headers: {
          "Content-Type": "application/json",
          "RequesterKey": requesterKey,
        },
      }
    );

    console.log("Resposta da API TudoEntregue:", response.data);
  } catch (error) {
    console.error("Erro ao enviar dados para TudoEntregue:", error.message);
    throw error;
  }
}

async function fazerRequisicoes() {
  try {
    // Verificar se o token ainda é válido
    if (await verificarTokenExpirado()) {
      await obterNovoAccessToken();
    }

    const hoje = new Date();
    // hoje.setDate(hoje.getDate() - 1); DATA ANTERIROR
    const dataDeHoje = hoje.toISOString().split("T")[0];

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

      // Obter detalhes do cliente
      const detalhesCliente = await obterDetalhesCliente(
        ultimoPedidoAtual.cliente.id
      );
      // Incluir as informações de ultimoPedidoAtual em detalhesCliente
      detalhesCliente.ultimoPedido = {
        id: ultimoPedidoAtual.id,
        status: ultimoPedidoAtual.status,
        numero: ultimoPedidoAtual.numero,
        data_criacao: ultimoPedidoAtual.data_criacao,
        valor_total: ultimoPedidoAtual.valor_total,
      };

      // Comparar com o último armazenado
      if (
        !ultimoPedidoArmazenado ||
        detalhesCliente.id !== ultimoPedidoArmazenado.id
      ) {
        console.log(
          "Houve uma alteração no último pedido. Atualizando variável."
        );
        ultimoPedidoArmazenado = detalhesCliente;

        await FormatarDados(detalhesCliente);
      } else {
        console.log(
          "Retorna o ultimo item, se for o mesmo: ",
          ultimoPedidoAtual
        );
      }
    }
  } catch (erro) {
    // Se o erro estiver relacionado à autenticação, tente obter um novo token e refaça a requisição
    if (erro.response && erro.response.status === 401) {
      console.log("Erro 401: Authentication de token", erro);
      await obterNovoAccessToken();
    }
  }
}

cron.schedule("*/5 * * * * *", fazerRequisicoes);

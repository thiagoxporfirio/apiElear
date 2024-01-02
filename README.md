# Integração entre API TagPlus e TudoEntregue

Este projeto consiste em uma integração automatizada entre a API TagPlus e a API TudoEntregue. A API TagPlus é utilizada para obter informações sobre pedidos de clientes, enquanto a API TudoEntregue é utilizada para criar ordens de entrega com base nos dados obtidos.

## Funcionalidades

- **Autenticação**: A aplicação faz uso de tokens de autenticação para acessar as APIs TagPlus e TudoEntregue. O token é automaticamente atualizado quando expira.

- **Obtenção de Pedidos**: A cada intervalo de 5 segundos, a aplicação faz uma requisição à API TagPlus para obter informações sobre os pedidos mais recentes. Essas informações incluem detalhes do cliente, status do pedido, número do pedido, valor total, entre outros.

- **Formatação e Envio de Dados**: Os dados obtidos da API TagPlus são formatados conforme as necessidades da API TudoEntregue. Isso inclui a formatação de documentos, endereços e outras informações relevantes. Após a formatação, os dados são enviados para a API TudoEntregue para criar uma ordem de entrega.

## Estrutura do Projeto

- **index.js**: Contém a lógica principal da aplicação, incluindo a definição de funções para autenticação, obtenção de dados, formatação de dados e envio para a API TudoEntregue.

- **funcoes.js**: Contém funções utilitárias, como formatação de CPF/CNPJ, remoção de caracteres não numéricos, entre outras.

- **cron**: Utiliza a biblioteca `node-cron` para agendar a execução da função principal em intervalos regulares.

## Configuração

Antes de executar a aplicação, certifique-se de configurar corretamente as seguintes variáveis no arquivo `index.js`:

- `client_id`: ID do cliente para autenticação na API TagPlus.
- `client_secret`: Chave secreta do cliente para autenticação na API TagPlus.
- `AppKey`: Chave da aplicação para autenticação na API TudoEntregue.
- `requesterKey`: Chave do requisitante para autenticação na API TudoEntregue.

## Instalação e Execução

1. Instale as dependências usando o comando:
   ```bash
   yarn

2. Execute a aplicação com o comando:
   ```bash
   yarn start || yarn dev

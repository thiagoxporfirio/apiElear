# API TagPlus

## Descrição
Este é um exemplo de aplicação que faz requisições a dois servidores utilizando a API TagPlus. A API TagPlus é uma API de terceiros que lida com operações relacionadas a produtos e pedidos.

## Autenticação
A autenticação com a API é realizada usando o OAuth 2.0. Um token de acesso é utilizado para autenticar as requisições. O token de acesso expira a cada 15 dias, e um fluxo de atualização (refresh token) é utilizado para obter um novo token quando necessário.

## Requisitos
- Node.js
- Biblioteca Axios

## Configuração
1. Instale as dependências usando `yarn`.
2. Configure as variáveis de ambiente necessárias, como `Access_Token`, `Refresh_Token`, `client_id`, e `client_secret`.
3. Execute o script usando `yarn start`.

## Funcionalidades
O script faz requisições a dois servidores diferentes, utilizando dados obtidos na resposta do primeiro servidor para realizar uma requisição ao segundo. Cada requisição inclui cabeçalhos específicos, como 'Authorization', 'X-Api-Version', e 'Content-Type'.

## Renovação Automática do Token
O script inclui uma lógica para verificar se o token de acesso ainda é válido antes de cada requisição. Se o token não for válido, uma requisição é feita para obter um novo token usando o refresh token.

## Como Usar
1. Configure as variáveis de ambiente conforme necessário.
2. Execute o script.
3. Observe os resultados no console.

## Aviso
Este é um exemplo simplificado e pode precisar ser adaptado para atender às especificações exatas da API TagPlus. Consulte a documentação oficial da API para obter informações detalhadas.

## Autor
Thiago Porfirio

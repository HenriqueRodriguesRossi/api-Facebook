# api-Facebook

Este é um clone de algumas das funcionalidades do facebook, 
utilizando Express.js, MongoDB Atlas, e algumas bibliotecas 
úteis como Yup para validação, jsonwebtoken para validação
de usuário, multer para upload de arquivos e cors, para 
a API aceitar requisições vindas de todas as origens


## Configuração

1. Clone este repositório
2. Instale as dependências usando `npm install`
3. Configure as variáveis de ambiente em um arquivo `.env`

```env
MONGO_USER = your_mongodb_atlas_user
MONGO_PASSWORD = your_mongodb_atlas_password
SECRET=your_secret_key

1 - Inicie a aplicação usando npm run dev

Endpoints

Cadastrar um novo usuário

POST /new-user

Endpoint para cadastrar um novo usuário.

Requisição:

{
  "first_name": "Nome",
  "last_name": "Sobrenome",
  "email": "email@example.com",
  "password": "senha123",
  "gender": "Masculino"
}

Login

POST /login

Endpoint para efetuar o login.

Requisição:

{
  "email": "email@example.com",
  "password": "senha123"
}

Buscar usuário

GET /find-user

Cadastrar um novo post

POST /new-post

Endpoint para cadastrar um novo post.

Requisição:

{
  "description": "Descrição do post",
  "src": "src da foto que deseja cadastrar"
}

Buscar posts

GET /find-post

Endpoint para buscar posts.

Excluir um post

DELETE /delete-post/:id

Endpoint para excluir um post. O ID do post deve ser passado como parâmetro na URL.

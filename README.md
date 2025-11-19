# Portal de Usuários

Um sistema simples de portal de usuários com funcionalidade de registro e login, construído com Node.js (Express), PostgreSQL para o backend e HTML, CSS, JavaScript puro para o frontend.

## 🚀 Funcionalidades

*   **Página Inicial de Boas-Vindas:** Apresenta o portal e direciona para as páginas de cadastro e login.
*   **Cadastro de Novos Membros:** Formulário para novos usuários se registrarem com nome, e-mail e senha.
*   **Login de Usuários Existentes:** Formulário para usuários autenticarem-se com e-mail e senha.
*   **Painel do Usuário:** Uma página simples acessível após o login, exibindo uma mensagem personalizada ao usuário logado.
*   **Autenticação Básica no Backend:** Validação de credenciais e hash de senhas (usando `bcryptjs`).
*   **Banco de Dados PostgreSQL:** Armazena informações de usuários (ID, nome, e-mail, senha hashed).
*   **Frontend Interativo:** HTML, CSS e JavaScript simples para interagir com a API do backend.

## 🛠️ Tecnologias Utilizadas

**Backend:**
*   **Node.js:** Ambiente de execução JavaScript.
*   **Express.js:** Framework web para Node.js.
*   **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional.
*   **`pg`:** Driver Node.js para PostgreSQL.
*   **`bcryptjs`:** Biblioteca para hash e comparação de senhas.
*   **`dotenv`:** Para carregar variáveis de ambiente de um arquivo `.env`.
*   **`cors`:** Middleware para habilitar Cross-Origin Resource Sharing.

**Frontend:**
*   **HTML5:** Estrutura das páginas web.
*   **CSS3:** Estilização das páginas.
*   **JavaScript: Lógica interativa das páginas e comunicação com o backend.

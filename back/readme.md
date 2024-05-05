# ChatEnvio - API

Este projeto é uma API para manipulação de mensagens em um sistema de chat. Ela inclui uma integração com WebSockets para envio em tempo real, usa `TypeORM` com MongoDB como banco de dados, e possui documentação da API gerada com Swagger.

## Estrutura de Arquivos

- `index.js`: Arquivo principal do servidor Express.
- `entity/Message.js`: Entidade que representa uma mensagem de chat.
- `swaggerConfig.js`: Configurações do Swagger para documentação da API.
- `.env`: Arquivo de variáveis de ambiente.
- `docker-compose.yml`: Configuração do Docker para execução do MongoDB.

## Pré-requisitos

- Node.js (>= 14.x)
- Docker e Docker Compose
- MongoDB

## Instalação e Execução

Siga os passos abaixo para instalar e executar o projeto:

### 1. Clonar o Repositório

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
DB_URL="mongodb://chatenvios:1234@localhost:27017/chat?authSource=admin"
```

### 4. Subir o Banco de Dados

```bash
docker-compose up
```

### 4. Iniciar o Servidor

```bash
npm start
```

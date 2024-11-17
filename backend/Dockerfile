# Dockerfile TypeScript
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar apenas os arquivos necessários para instalar dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código para o contêiner
COPY . .

# Expor as portas usadas pelos servidores
EXPOSE 3000 8080

# Comando padrão para o ambiente de desenvolvimento
CMD ["npm", "run", "dev"]

### Erasmo Cardoso
#  Dockerfile TypeScript
FROM node:18

# diretório de trabalho 
WORKDIR /usr/src/app

#  package.json e package-lock.json
COPY package*.json ./

#  dependências
RUN npm install

# Copiar o restante do código para o container
COPY . .

# Rodar o build do TypeScript
RUN npm run build  

# Expor
EXPOSE 3000

# App
CMD ["node", "dist/app.js"]

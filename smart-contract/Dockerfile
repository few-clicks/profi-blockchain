FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install -g truffle
RUN npm install

COPY . .

RUN truffle compile

CMD ["truffle", "migrate", "--network", "development"]

FROM node:18-alpine AS development

WORKDIR /src/app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY build.json .

RUN npm i

RUN npm install --dev tsconfig-paths tscpaths

COPY src/ src/

ENV NODE_PATH=./build

CMD ["npm", "start:dev"]

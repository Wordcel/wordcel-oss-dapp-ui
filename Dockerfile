FROM node:16

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL?envdberror}

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn prisma generate
RUN yarn build
CMD yarn start

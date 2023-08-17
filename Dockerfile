FROM node:16
ARG ABC=1
ARG POSTGRES_URL
ENV POSTGRES_URL ${POSTGRES_URL?envdberror}

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn prisma generate
RUN yarn build
CMD yarn start

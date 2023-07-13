FROM node:16.4.2-alpine
WORKDIR /AUTHPROJECT
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm run build
CMD ["npm", "start"]
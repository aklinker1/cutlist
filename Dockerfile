# Run `nuxt build` before `docker build`
FROM node:alpine
WORKDIR /app
COPY .output .output
RUN ls -lA .
CMD [ "node", ".output/server/index.mjs" ]

require('make-promises-safe');
const fastify = require('fastify')({
  logger: true,
});
const poetry = require('./routes/poetry');

fastify.register(poetry);

const corsHeader = {
  name: 'Access-Control-Allow-Origin',
  value: process.env.PORT ? 'https://color-golf.netlify.app' : 'http://localhost:8080',
};
fastify.get('/', async (request, reply) => {
  reply.header(corsHeader.name, corsHeader.value);
  reply.send(`Hi! This is the url for the poetry reader api. Access the app here: ${corsHeader.value}`);
});

const start = async () => {
  const port = process.env.PORT || 3000;
  try {
    await fastify.listen(port);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

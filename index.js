require('make-promises-safe');
const fastify = require('fastify')({
  logger: true,
});
const poetry = require('./routes/poetry');

fastify.register(poetry);

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

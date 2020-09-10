const axios = require('axios');
const baseRouteUrl = '/poetry';
const corsHeader = {
  name: 'Access-Control-Allow-Origin',
  value: process.env.PORT ? 'https://color-golf.netlify.app' : 'http://localhost:8080',
};

async function routes(fastify, options) {
  fastify.get(baseRouteUrl + '/authors', async (request, reply) => {
    reply.header(corsHeader.name, corsHeader.value); // TODO there must be a way to set this as the header for everything in 1 line!!!!
    try {
      const axiosRes = await axios.get('https://poetrydb.org/author');
      reply.send(axiosRes.data);
    } catch (err) {
      console.log(err);
      reply.status(500).send();
    }
  });

  fastify.get(baseRouteUrl + '/author/:authorName', async (request, reply) => {
    reply.header(corsHeader.name, corsHeader.value);
    const authorName = request.params.authorName;

    try {
      const axiosRes = await axios.get(`https://poetrydb.org/author/${authorName}:abs/author,title,linecount`);
      reply.send(axiosRes.data);
    } catch (err) {
      console.log(err);
      reply.status(500).send();
    }
  });

  fastify.get(baseRouteUrl + '/title/:titleName/author/:authorName', async (request, reply) => {
    reply.header(corsHeader.name, corsHeader.value);
    const authorName = request.params.authorName;
    let titleName = request.params.titleName;
    titleName = trimToCharLimit(titleName);

    try {
      const axiosRes = await axios.get(`https://poetrydb.org/title/${titleName}`);
      // if multiple authors used the same title the poetry DB returns all poems so we must filter the author
      const poemsData = axiosRes.data.filter(poem => {
        return poem.author === authorName;
      });
      reply.send(poemsData);
    } catch (err) {
      console.log(err);
      reply.status(500).send();
    }
  });

};

function trimToCharLimit(string) {
  const maxLength = 50;
  if (string.length > maxLength) return string.substring(0, maxLength);
  return string;
}

module.exports = routes;

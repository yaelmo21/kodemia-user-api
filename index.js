const _ = require('underscore');
const fastify = require('fastify');
const mongoose = require('mongoose');

const global = require('./global');
const Heroe = require('./Heroe.model');

const server = fastify({ logger: false });
server.register(require('fastify-cors'));
server.register(require('fastify-formbody'));

server.get('/heroes', async(request, reply) => {
    const from = Number(request.query.from) || 0;
    const to = Number(request.query.to) || 5;
    const heroes = await Heroe.find().skip(from).limit(to);
    reply.send({ ok: true, heroes });
});

server.post('/heroe', async(request, reply) => {
    const data = _.pick(request.body, ['nombre', 'alias', 'imagen']);
    const heroe = await new Heroe(data).save();
    reply.send({ ok: true, heroe });
});

server.put('/heroe/:id', async(request, reply) => {
    const heroeId = request.params.id;
    const data = _.pick(request.body, ['nombre', 'alias', 'imagen']);
    const heroe = await Heroe.findByIdAndUpdate(heroeId, data, { new: true })
    reply.send({ ok: true, heroe });
});

server.delete('/heroe/:id', async(request, reply) => {
    const heroeId = request.params.id;
    const count = await Heroe.countDocuments();
    if (count <= 3) {
        reply.code(400).send({
            ok: false,
            menssage: 'No puedes eliminar este héroe, otros Koders necesitan que existan héroes en esta Base de datos :)',
        });
        return;
    }

    await Heroe.findByIdAndDelete(heroeId);
    reply.send({
        ok: true,
        menssage: 'Héroe eliminado',
        _id: heroeId
    });
});



const main = async() => {
    console.log(global);
    await mongoose.connect(global.urlDb);
    await server.listen(global.port, global.host);
    console.log(`Escuchando en el puerto: ${global.port}`);
}

main();
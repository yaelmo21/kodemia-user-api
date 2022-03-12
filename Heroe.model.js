const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heroeSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    alias: {
        type: String,
    },
    imagen: {
        type: String,
    }
});

module.exports = mongoose.model('heroe', heroeSchema);
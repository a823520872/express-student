const mongoose = require('mongoose')
const {
    Schema,
    Schema: { ObjectId },
} = mongoose

const Addr = new Schema({
    id: Number,
    title: String,
    level: Number,
    parentId: Number,
})

module.exports = mongoose.model('addr', Addr)

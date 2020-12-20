const mongoose = require('mongoose')
const {
    Schema,
    Schema: { ObjectId },
} = mongoose

const Test = new Schema({
    id: Number,
    title: String,
    level: Number,
    parentId: Number,
})

module.exports = mongoose.model('test', Test)

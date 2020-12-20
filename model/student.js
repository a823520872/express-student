const mongoose = require('mongoose')
const {
    Schema,
    Schema: { ObjectId },
} = mongoose

const Student = new Schema({
    id: Number,
    name: String,
    gender: Number,
    birthday: String,
    address: {
        province: ObjectId,
        city: ObjectId,
        country: ObjectId,
    },
    detail: String,
    email: String,
})

module.exports = mongoose.model('student', Student)

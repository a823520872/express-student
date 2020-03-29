const mongoose = require('mongoose')
const config = require('../config')

class DB {
    connect() {
        return mongoose.connect(config.db, {
            keepAlive: 1,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
}

module.exports = new DB()

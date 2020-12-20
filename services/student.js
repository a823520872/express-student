const Student = require('../model/student')

class StudentService {
    create(stu) {
        return Student.create(stu)
    }
    findById(stu) {
        return Student.findById(stu.id)
    }
    findByPage(stu) {
        return Student.find(stu)
    }
    count(stu) {
        return Student.count(stu)
    }
    findOneAndUpdate(stu) {}
}

module.exports = new StudentService()

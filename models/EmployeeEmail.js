const mongoose = require('mongoose');

const employeeEmailSchema = new mongoose.Schema({
    worker: [{
        type: "String",
    }],
    supervisor: [
        {
            type: "String",
        }
    ],
    authority: [
        {
            type: "String",
        }
    ],
});

module.exports = mongoose.model('employeeEmail', employeeEmailSchema);
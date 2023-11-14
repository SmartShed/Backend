const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = mongoose.Schema({
    formID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    sectionID: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
    submittedCount: { type: Number, default: 0 },
    lockStatus: { type: Boolean, default: false },
    access: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    history: [{
        editedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        editedAt: { type: Date, default: Date.now },
        changes: [{
            questionID: { type: Schema.Types.ObjectId, ref: 'Question' },
            oldValue: { type: String },
            newValue: { type: String },
        }],
    }],
});

module.exports = mongoose.model('Form', formSchema);
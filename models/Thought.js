const { ObjectId } = require('mongodb');
const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: ObjectId,
            default: new ObjectId
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                formattedDate = date.toDateString();
                return formattedDate
            }
        }
    }
)

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                formattedDate = date.toDateString();
                return formattedDate
            }
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    }
)

const Thought = model('thought', thoughtSchema);

module.exports = Thought;

const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();

            res.json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({
                _id: req.params.userId
            })

            if (!user) {
                return res.status(404).json({
                    message: 'No users with that ID!'
                })
            }

            res.json({
                user,
                thought: await thought(req.params.userId)
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
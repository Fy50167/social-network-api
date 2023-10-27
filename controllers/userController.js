const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find().select('-__v');

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
            }).select('-__v');

            if (!user) {
                return res.status(404).json({
                    message: 'No users with that ID!'
                })
            }

            res.json(user)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async createUser(req, res) {
        try {
          const user = await User.create(req.body);
          res.json(user);
        } catch (err) {
          res.status(500).json(err);
        }
    },

    async updateUser(req,res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
    
            if (!user) {
            res.status(404).json({ message: 'No user with this ID!' });
            }
    
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteUser(req, res) {
        try {
          const user = await User.findOneAndDelete({ _id: req.params.userId });
    
          if (!user) {
            res.status(404).json({ message: 'No user with this ID!' });
          }
    
          await Thought.deleteMany({ _id: { $in: user.thoughts } });

          res.json({ message: 'User and all associated thoughts deleted.' });
        } catch (err) {
          res.status(500).json(err);
        }
      },

    async addFriend(req, res) {
        try {
            const friend = await User.findOne({
                _id: req.params.friendId
            }).select('-__v');

            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { friends: friend } },
                { runValidators: true, new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user with that ID!' });
            }

            if (!friend) {
                res.status(404).json({ message: 'No friend with that ID!' });
            }
            
            res.json({ message: 'Friend successfully added.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteFriend(req,res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user with that ID!' });
            }

            if (!req.params.friendId) {
                res.status(404).json({ message: 'No friend with that ID!' });
            }
    
            res.json({ message: 'Friend successfully deleted.'});
        } catch (err) {
            res.status(500).json(err);
        }
    }
}
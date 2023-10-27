const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
    async getThoughts(req, res) {
        try {
            const thought = await Thought.find().select('-__v');

            res.json(thought);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({
                _id: req.params.thoughtId
            }).select('-__v');

            if (!thought) {
                return res.status(404).json({
                    message: 'No thoughts with that ID!'
                })
            }

            res.json(thought)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
          const thought = await Thought.create(req.body);

          const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: thought } },
            { runValidators: true, new: true }
          );

          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    },

    async updateThought(req,res) {
        try {
            const thought = await Thought.findOneAndUpdate(
              { _id: req.params.thoughtId },
              { $set: req.body },
              { runValidators: true, new: true }
            );
    
            if (!thought) {
              res.status(404).json({ message: 'No thought with this ID!' });
            }
    
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
          if (!thought) {
            res.status(404).json({ message: 'No thought with this ID!' });
          }

          if (!req.body.userId) {
            res.status(404).json({ message: 'Please specify the user that this is being deleted from!' })
          }

          const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $pull: { thoughts: req.params.thoughtId } },
            { runValidators: true, new: true }
          );

          res.json({ message: 'Thought has been deleted.' });
        } catch (err) {
          res.status(500).json(err);
        }
    },

    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought with that ID!' });
            }

            res.json({ message: 'Reaction successfully created.'});
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteReaction(req,res) {
        console.log(req.params);
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { "reactionId": req.params.reactionId } } },
                { runValidators: true, new: true }
            );
            
            if (!thought) {
                res.status(404).json({ message: 'No thought with that ID!' });
            }
    
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    createUser: async (args) => {
        try {
            const user = new User({
                email: args.userInput.email,
                password: args.userInput.password
            });
            const result = await user.save();
            console.log(result);
            return {
                ...result._doc,
                password: null,
                _id: result.id
            };
        } catch (err) {
            throw err;
        };
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };
    },
};
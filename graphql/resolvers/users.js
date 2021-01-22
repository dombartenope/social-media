require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const User = require('../../models/User');

//Generate JWT for user
const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, process.env.JWT_KEY, { expiresIn: '1h' });
}

module.exports = {
    Mutation: {
        //LOGIN VALIDATION
        async login(_, { username, password }){

            const { errors, valid } = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Error', { errors });
            };

            const user = await User.findOne({ username });

            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){ 
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        //REGISTRATION VALIDATION
        async register(_, 
            { 
                registerInput: { username, email, password, confirmPassword } 
            }){

            //VALIDATE DATA
            const { valid, errors } = validateRegisterInput(username, email,password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors });
            };

            //CHECK IF USER EXISTS
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username Already Exists', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            //HASH PASSWORD AND CREATE TOKEN
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
};
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

module.exports = (context) => {
    //Header
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //Bearer 
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try{
                const user = jwt.verify(token, process.env.JWT_KEY);
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired Token');
            }
        }
        throw new Error(`Token must be "Bearer [token]"`);
    }
    throw new Error(`Authorization header must be provided`);
}
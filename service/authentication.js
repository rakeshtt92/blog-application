const JWT = require('jsonwebtoken');
const secret = '$Rakeshtt@123';



function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        fullName: user.fullName
    };
    const token = JWT.sign(payload, secret);
    return token
}


function verifyToken(token) {
    try {
        const payload = JWT.verify(token, secret);
        return payload
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}   


module.exports = {
    generateToken,      
    verifyToken
};
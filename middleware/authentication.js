
const { verifyToken } = require('../service/authentication');

function checkForauthenticationUser(cookieName) {
    return (req, res, next) => {
        const tokenValue = req.cookies[cookieName];
        if (!tokenValue) {
            return next()
        }

        try {
            const userPayload = verifyToken(tokenValue);
            console.log('User payload:', userPayload);
            req.user = userPayload;
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized' });
        }

        next();
    };

}


module.exports  = {
    checkForauthenticationUser
};
const {Router} = require('express');
const User = require('../models/user');
const { render } = require('ejs');
const router = Router();


router.get('/signin', (req, res) => {
    return res.render('signin')
});

router.get('/signup', (req, res) => {
    return res.render('signup')
});


router.post('/signup', async (req, res) => {
    console.log('body', req.body);
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).send('All fields are required');
    }   

    await User.create({
        fullName,   
        email,
        password,
    })

    return res.redirect('/user/signin');
});


router.get('/logout', (req, res) => {
    return res.clearCookie('token').redirect('/');
});

router.post('/signin', async (req, res) => {
    console.log("Password from request body:", req.body.password);

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    try {
        const token = await user.matchPasswordAndGenerateToken(password);
        console.log('token', token);
        return res.cookie('token', token).redirect('/');
    }
    catch (error) {
        return res.render('signin', { error: 'Invalid email or password' });
    }   
})




module.exports = router;


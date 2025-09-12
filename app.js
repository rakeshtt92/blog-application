require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const path = require('path');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const Blog = require('./models/blog');

const mongoose = require('mongoose');
const { checkForauthenticationUser } = require('./middleware/authentication');
const cookieParser = require('cookie-parser');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForauthenticationUser('token'));
app.use(express.static(path.resolve('./public')));
app.use('/public', express.static('public'));


mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/blogify-aws', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})

app.use('/user', userRouter);    
app.use('/blog', blogRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
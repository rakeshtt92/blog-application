const { Router } = require('express');
const router = Router();
const multer  = require('multer')
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const fs = require('fs');
const uploadsPath = path.resolve('./public/uploads');
const { checkForauthenticationUser } = require('../middleware/authentication');

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

router.get('/addnewBlog', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    });
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage })


router.post('/', checkForauthenticationUser('token'), upload.single('coverImage'), async(req, res) => {
    console.log('Blog data:', req.body);
    console.log('Blog file:', req.user);
    const { title, content } = req.body;

    const blog = await Blog.create({
        title,
        content,
        coverImageUrl: req.file ? `/uploads/${req.file.filename}` : null,      
        createdBy: req.user.id
    })
    return res.redirect(`/blog/${blog._id}`);
})


router.get('/:id', async(req, res) => {
   const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    console.log('Comments:', comments);
   console.log('Blog:', blog);
    return res.render('blog', {
        user: req.user,
        blog,
        comments
    })
})

router.post('/comment/:blogId', async(req, res) => {
    console.log('Comment data:', req.body);
    const comment = await Comment.create({
        content: req.body.comment,
        createdBy: req.user.id,
        blogId: req.params.blogId
    });

    return res.redirect(`/blog/${req.params.blogId}`);
})



module.exports = router;



const express = require('express');
const router = express.Router();
const postService = require('../service/postsService');



router.get('/posts', async (req, res, next) => {
    try {
        const posts = await postService.getPosts();
        res.json(posts); 
    } catch (error) {
        next(e);
    }
});

router.post('/posts', async (req, res, next) => {
    const post = req.body;
    try {
        const newPost = await postService.savePost(post);
        res.status(201).json(newPost);
    } catch (e) {
        next(e);
    }
});

router.put('/posts/:id', async (req, res, next) => {
    const post = req.body;
    try {
        await postService.updatePost(req.params.id, post);
        res.status(204).end();
    } catch (e) {
        next(e);
    }
});

router.delete('/posts/:id', async (req, res, next) => {
    try {
        await postService.deletePost(req.params.id)
        res.status(204).end();
    } catch (error) {
       next(e);
    }
});

module.exports = router;
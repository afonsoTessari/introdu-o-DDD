const crypto = require('crypto')
const axios = require('axios');
const postsService = require('../service/postsService');

const generate = () => {
    return crypto.randomBytes(20).toString('hex');
};

const request = (url, method, data) => {
    return axios({ url, method, data, validateStatus: false });
};

test('should get a posts', async function () {

    const post1 = await postsService.savePost({title:generate(), content: generate()});
    const post2 = await postsService.savePost({title:generate(), content: generate()});
    const post3 = await postsService.savePost({title:generate(), content: generate()});

    let response = await request('http://localhost:3000/posts', 'get')
    expect(response.status).toBe(200);
    let posts = response.data

    expect(posts).toHaveLength(3);
    await postsService.deletePost(post1.id)
    await postsService.deletePost(post2.id)
    await postsService.deletePost(post3.id)
})

test('should save a posts', async function () {
    const data = {title:generate(), content: generate()};
    let response = await request('http://localhost:3000/posts', 'post', data);
    expect(response.status).toBe(201);
    const post = response.data;

    expect(post.title).toBe(data.title);
    expect(post.content).toBe(data.content);
    await postsService.deletePost(post.id);
})

test('should not save a posts', async function () {
    const data = {title:generate(), content: generate()};
    let response1 = await request('http://localhost:3000/posts', 'post', data);
    let response2 = await request('http://localhost:3000/posts', 'post', data);
    expect(response2.status).toBe(409);
    const post = response1.data;
    await postsService.deletePost(post.id);
})

test('should update a posts', async function () {
    const post = await postsService.savePost({ title:generate(), content: generate() });
    post.title = generate();
    post.content = generate();
    let response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    expect(response.status).toBe(204);
    const updatePost = await postsService.getPost(post.id);
    expect(updatePost.title).toBe(post.title);
    expect(updatePost.content).toBe(post.content);
    await postsService.deletePost(post.id);
})

test('should not update a posts', async function () {
    const post = {
        id: 1
    }
    let response = await request(`http://localhost:3000/posts/${post.id}`, 'put', post);
    expect(response.status).toBe(404);

})

test('should delete a posts', async function () {
    const post = await postsService.savePost({ title:generate(), content: generate() });
    let response = await request(`http://localhost:3000/posts/${post.id}`, 'delete');
    expect(response.status).toBe(204);
    const posts = await postsService.getPosts();
    expect(posts).toHaveLength(0);
})
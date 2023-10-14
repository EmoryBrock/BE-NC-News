const app = require('../app.js');
const db = require('../db/connection.js')
const request = require('supertest');
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
// const endpoints = require('../endpoints.json')

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
 return db.end()
})

describe('GET /api/topics', () => {
    test('returns an array of topic objects of the correct format', ()=> {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic)=>{
                    expect(typeof(topic.slug)).toBe('string')
                    expect(typeof(topic.description)).toBe('string')
                })
            })
    })
})
// NEED TO FIX
// describe('GET /api', () => {
//     test('returns an object describing the valid inital TEST endpoints',() => {
//         return request(app)
//         .get('/api')
//         .expect(200)
//         .then(({ body }) => {
//             const siteMap = body.mapAPI
            
//             expect(typeof siteMap).toBe("object")
//             expect(siteMap.hasOwnProperty('GET /api')).toBe(true)
//             expect(typeof(siteMap['GET /api'].description)).toBe("string")
//             expect(siteMap.hasOwnProperty('GET /api/topics')).toBe(true)
//             expect(typeof(siteMap['GET /api/topics'].description)).toBe("string")
//             expect(siteMap.hasOwnProperty('GET /api/articles')).toBe(true)
//             expect(typeof(siteMap['GET /api/articles'].description)).toBe("string")
//         })
//     })
    // test('output of GET API matches the endpoint JSON file object', ()=>{
    //     return request(app)
    //         .get('/api')
    //         .then(({ body }) => {
    //             expect(body.mapAPI).toEqual(endpoints)
    //         })
    // })
    //Add a dynamic check of vaild endpoints against JSON object
// })

describe('GET /api/articles', () => {
    test('returns an array of article objects of the correct format', ()=> {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13)
            body.articles.forEach((articles)=>{
                expect(articles).toHaveProperty('author');
                expect(articles).toHaveProperty('title');
                expect(articles).toHaveProperty('article_id');
                expect(articles).toHaveProperty('topic');
                expect(articles).toHaveProperty('created_at');
                expect(articles).toHaveProperty('votes');
                expect(articles).toHaveProperty('article_img_url');
                expect(articles).toHaveProperty('comment_count');
            })
        })
    }) 
    test('returns an array of article objects in desceding order by date created', ()=>{
        return request(app)
        .get('/api/articles')
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true,
            })
        })
    })
    test('returns an array of article objects that does not include article body', ()=> {
        return request(app)
        .get('/api/articles')
        .then(({body}) => {
            body.articles.forEach((articles)=>{
                expect(articles).not.toHaveProperty('body');
            })
        })
    })
})

describe('Endpoint general errors', () => {
    test('404 status code and error message when passed a misspelled GET /api/articles endpoint', ()=>{
        return request(app)
        .get('/api/articlez')
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('path not found')
        })
    })
    test('404 status code and error message when passed a misspelled GET /api endpoint', ()=>{
        return request(app)
        .get("/dpi")
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('path not found')
        })
    })
    test('404 status code and error message when passed a misspelled GET /api/topics endpoint', ()=>{
        return request(app)
            .get("/api/topicz")
            .expect(404)
            .then(({body})=> {
                expect(body.message).toBe('path not found')
            })
        })
})


describe('GET /api/articles/:article_id', ()=>{
    test('responds with a 200 status code', () => {
        return request(app)
            .get('/api/articles/2')
            .expect(200);
    })
    test('responds with the correct article object', ()=>{
        return request(app)
            .get('/api/articles/12')
            .then(({body})=>{
                expect(body.article.article_id).toBe(12)
                expect(body.article.title).toBe('Moustache')
                expect(body.article.topic).toBe('mitch')
                expect(body.article.author).toBe('butter_bridge')
                expect(body.article.body).toBe('Have you seen the size of that thing?')
                expect(body.article.created_at).toBe('2020-10-11T11:24:00.000Z')
                expect(body.article.votes).toBe(0)
                expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
})
test('responds with 404 if query is called with a valid number input', () => {
    return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('No article found with id 9999')
        })
})
test('responds with 400 if query is called with a invalid number input', () => {
    return request(app)
        .get('/api/articles/two')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe('bad request: this is not a number')
        })
})
})  

describe('GET /api/articles/:article_id/comments', () => {
    test('returns an array of comment object(s) of the queried article in the correct format', ()=> {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toBeSortedBy('created_at', {descending: true,})
            body.forEach((comment)=>{
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('article_id');    
            })
        })
    })
    test('returns an empty array if article id does exist but does not have comments', ()=> {
        return request(app)
        .get('/api/articles/13/comments')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toEqual([])
            })
     })
    test('returns a 400 if an invalid article_id is provided', ()=>{
        return request(app)
        .get('/api/articles/three/comments')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe(`bad request`)
            })
    })
    test('returns a 404 if passed an article_id that does not exist in the database', ()=>{
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe(`No article found for id 9999`)
            })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('adds a comment to the queried article', ()=>{
        //should add another assertion that the new comment_id should be 19 [not sure how to implement as comment_id is not contained in the send message]
        const newComment = {
            username: "rogersop",
            body: "this is an added comment."
        }

        return request (app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then((response)=> {
                const comment = response.body;
                expect(comment).toEqual(newComment)
            })
    })
    test('adds a comment to the queried article while ignoring any unnecessary properties' ,()=>{
        const newCommentInput = {
            username: "rogersop",
            body: "this is an added comment.",
            rank: "daily contributor"
        }
        const newCommentOutput = {
            username: "rogersop",
            body: "this is an added comment.",
        }

        return request (app)
        .post('/api/articles/1/comments')
        .send(newCommentOutput)
        .expect(201)
        .then((response)=> {
            const comment = response.body;
            expect(comment).toEqual(newCommentOutput)
            expect(newCommentOutput).not.toEqual(newCommentInput)
        })
    })
    test('returns a 400 if the queried article id is invalid' ,()=>{
        const newComment = {
            username: "rogersop",
            body: "this is an added comment."
        }

        return request (app)
        .post('/api/articles/two/comments')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe('bad request')
        })
    })
    test('returns a 400 if body property is not provided by user' ,()=>{
        const newComment = {username: "rogersop"}        
        
        return request (app)
        .post('/api/articles/1/comments')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe('bad request')
        })
    })
    test('returns a 400 if username property is not provided by user' ,()=>{
        const newComment = { body: "this is an added comment."}

        return request (app)
        .post('/api/articles/1/comments')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe('bad request')
        })
    })
    test('returns a 404 if the queried article id is a valid input but does not exist in database' ,()=>{
        const newComment = {
            username: "rogersop",
            body: "this is an added comment.",
        }

        return request (app)
        .post('/api/articles/9999/comments')
        .send(newComment)
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('No article found with id 9999')
        })
    })      
    test('returns a 404 if username does not exist in database' ,()=>{
        const newComment = {
            username: "toriamos",
            body: "this is an added comment.",
        }

        return request (app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('Username does not exist')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('responds with 200 and the queried article object with the votes increased by stated amount', ()=>{
        const newVotesUpdate = {inc_votes: 100}
        return request(app)
            .patch('/api/articles/12')
            .send(newVotesUpdate)
            .expect(200)
            .then(({body})=>{
                expect(body.article).toMatchObject({
                    article_id: 12,
                    title: 'Moustache',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'Have you seen the size of that thing?',
                    created_at: '2020-10-11T11:24:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    })
    test('responds with 200 and the queried article object with the votes decreased by stated amount', ()=>{
        const newVotesUpdate = {inc_votes: -100}
        return request(app)
            .patch('/api/articles/12')
            .send(newVotesUpdate)
            .expect(200)
            .then(({body})=>{
                expect(body.article).toMatchObject({
                    article_id: 12,
                    title: 'Moustache',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'Have you seen the size of that thing?',
                    created_at: '2020-10-11T11:24:00.000Z',
                    votes: -100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    })
    test('responds with 400 the queried article id is invalid', ()=>{
        const newVotesUpdate = {inc_votes: 100}
        return request(app)
            .patch('/api/articles/two')
            .send(newVotesUpdate)
            .expect(400)
            .then(({body})=> {
                expect(body.message).toBe('bad request')
            })
        })
    test('responds with 400 if passed inc_votes is not a number', ()=>{
        const newVotesUpdate = {inc_votes: "one hundred"}
        return request(app)
            .patch('/api/articles/two')
            .send(newVotesUpdate)
            .expect(400)
            .then(({body})=> {
                expect(body.message).toBe('bad request')
        })
    })
    test('responds with 404 if passed a number article id that does not exist', ()=>{
        const newVotesUpdate = {inc_votes: 100}
        return request(app)
            .patch('/api/articles/9999')
            .send(newVotesUpdate)
            .expect(404)
            .then(({body})=> {
                expect(body.message).toBe('No article found with id 9999')
        })
    })       
})

describe.only('DELETE /api/comments/:comment_id', () => {
    test('responds with 204 that the queried comment id was deleted', ()=>{
        return request(app)
            .delete('/api/comments/18')
            .expect(204)
    })
    test('responds with 404 that queried comment id is a valid number input but does not exist in database ', ()=>{
        return request(app)
            .delete('/api/comments/23')
            .expect(404)
            .then(({body})=> {
                expect(body.message).toBe('No comment found with id 23')
            })
    })
    test('responds with 400 that queried comment id is invalid ', ()=>{
        return request(app)
            .delete('/api/comments/five')
            .expect(400)
            .then(({body})=> {
                expect(body.message).toBe('bad request')
            })
    })
})

describe('GET /api/users', () => {
    test('responds with a list of all users', ()=> {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toHaveLength(4)
                expect(Array.isArray(body.users)).toBe(true)
                body.users.forEach((user)=>{
                    expect(typeof user.username).toBe('string')
                    expect(typeof user.name).toBe('string')
                    expect(typeof user.avatar_url).toBe('string')
                })
            })
    })
})

describe('GET /api/users', () => {
    test('responds with a list of all users', ()=> {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toHaveLength(4)
                expect(Array.isArray(body.users)).toBe(true)
                body.users.forEach((user)=>{
                    expect(typeof user.username).toBe('string')
                    expect(typeof user.name).toBe('string')
                    expect(typeof user.avatar_url).toBe('string')
                })
            })
    })
})
const app = require('../app.js');
const db = require('../db/connection.js')
const request = require('supertest');
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
 db.end()
})

describe('GET /api/topics', () => {
    test('responds with a 200 status code', () => {
        return request(app).get('/api/topics').expect(200);
    })
    test('returns an array of topic objects of the correct format', ()=> {
        return request(app)
            .get('/api/topics')
            .then(({ body }) => {
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic)=>{
                    expect(typeof(topic.slug)).toBe('string')
                    expect(typeof(topic.description)).toBe('string')
                })
            })
    })
    test('404 status code and error message when passed a misspelled endpoint', ()=>{
        return request(app)
            .get("/api/topicz")
            .expect(404)
            .then(({body})=> {
                expect(body.message).toBe('path not found')
            })
        })
})

describe('GET /api', () => {
    test('responds with 200 status code', () =>{
        return request(app).get('/api').expect(200);
    })
    test('returns an object describing the valid inital TEST endpoints',() => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                const siteMap = body.mapAPI

                expect(typeof siteMap).toBe("object")
                expect(siteMap.hasOwnProperty('GET /api')).toBe(true)
                expect(typeof(siteMap['GET /api'].description)).toBe("string")
                expect(siteMap.hasOwnProperty('GET /api/topics')).toBe(true)
                expect(typeof(siteMap['GET /api/topics'].description)).toBe("string")
                expect(siteMap.hasOwnProperty('GET /api/articles')).toBe(true)
                expect(typeof(siteMap['GET /api/articles'].description)).toBe("string")
            })
    })
    test('404 status code and error message when passed a misspelled endpoint', ()=>{
        return request(app)
            .get("/dpi")
            .expect(404)
            .then(({body})=> {
                expect(body.message).toBe('path not found')
            })
        })
})

describe('GET /api/articles', () => {
    test('responds with 200 status code', () =>{
        return request(app).get('/api/articles').expect(200);
    })
    test('returns an array of article objects of the correct format', ()=> {
        return request(app)
            .get('/api/articles')
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
    test('404 status code and error message when passed a misspelled endpoint', ()=>{
        return request(app)
        .get('/api/articlez')
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('path not found')
        })
    })
})
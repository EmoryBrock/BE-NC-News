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
                console.log(body, "in app test")
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
    // error testing.  404 if enter a valid number id, 400 Bad request if enter "two" id reject at controller, 
    // test('responds with 404 if query is called with a valid number input', () => {
    //     return request(app)
    //         .get('/api/article/9999')
    //         .expect(404)
    //         .then(({body})=> {
    //             console.log(body.message, "in test")
    //             expect(body.message).toBe('No article found for id 9999')
    //         })
    // })
    // test.only('responds with 400 if query is called with a invalid number input', () => {
    //     return request(app)
    //         .get('/api/article/two')
    //         .expect(400)
    //         .then(({body})=> {
    //             console.log(body.message, "in test")
    //             expect(body.message).toBe('bad request: this is not a number')
    //         })
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
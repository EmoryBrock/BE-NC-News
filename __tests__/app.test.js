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
    // test('returns an object describing all the endp')
})
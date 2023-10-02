const app = require('../app.js');
const express = require('express');
const request = require('supertest');

describe('GET /api/topics', () => {
    test('responds with a 200 status code', () => {
        return request(app).get('/api/topics').expect(200);
    })
    test('returns an array of topic objects of the correct format', ()=> {
        return app('/api/topics')
            .get('/api/topics')
            .then(({ body }) => {
                body.topics.forEach((topic)=>{
                    expect(typeof(topic.slug)).toBe('string')
                    expect(typeof(topic.descritpion))
                })
            })
    })
})
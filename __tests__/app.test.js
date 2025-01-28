const endpointsJson = require("../endpoints.json");
const db = require ("../db/connection")
const request = require("supertest")
const app = require("../app");
const testdata = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");

beforeEach (()=>{
  return seed(testdata)
})

afterAll(()=>{
  return db.end()
})


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () =>{
  test (" will all data from topics table in the database", ()=>{
    return request (app)
    .get("/api/topics")
    .expect(200)
    .then (({body})=>{

      console.log(body.topics)
      
      expect(Array.isArray(body.topics)).toBe(true)
      expect(body.topics).toEqual(  [
        { slug: 'mitch', description: 'The man, the Mitch, the legend' },
        { slug: 'cats', description: 'Not dogs' },
        { slug: 'paper', description: 'what books are made of' }
      ])
      expect(body.topics[0]).toMatchObject( { slug: 'mitch', description: 'The man, the Mitch, the legend' })
      
    })

  })

  test("test for bad path request", ()=>{
    return request (app)
    .get("/api/topic")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Path not found")

    })
  })
})


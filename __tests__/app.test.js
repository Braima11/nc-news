const endpointsJson = require("../endpoints.json");
const db = require ("../db/connection")
const request = require("supertest")
const app = require("../app");
const testdata = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");
const sorted  = require('jest-sorted');

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

describe("GET /api/articles/:article_id", ()=>{
  test("get article by id from the database",()=>{
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body})=>{
      expect(body.article.length).toBe(1)
      expect(body.article[0]).toHaveProperty("article_id")
      expect(body.article[0]).toHaveProperty("article_img_url")
      expect(body.article[0]).toHaveProperty("author")
      expect(body.article[0]).toHaveProperty("body")
    })
  })

  test ("test for a id request that is out of range", () =>{
    return request(app) 
    .get("/api/articles/15")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Article not found with this Id")
    })
  })

  test ("test for an invalid id", () =>{
    return request(app) 
    .get("/api/articles/super")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Invalid Id Input, Id must be an Integer")
    })
  })
})

describe("GET /api/articles", ()=>{
  test ("get all articles from database",()=>{
    return request (app)
    .get("/api/articles")
    .expect(200)
    .then ((articles)=>{
      const keysInArticle= articles.body.article[12]

      expect(articles.body.article.length).toBe(13)
      expect(keysInArticle).toHaveProperty("article_id")
      expect(keysInArticle).toHaveProperty("topic")
      expect(keysInArticle).toHaveProperty("author")
      expect(keysInArticle).toHaveProperty("created_at")
      expect(keysInArticle).toHaveProperty("votes")
      expect(keysInArticle).toHaveProperty("article_img_url")
      expect(articles.body.article).toBeSortedBy('created_at',{descending: true})
      
    })
  })
  test("404: responds with error for incorrect path", () => {
    return request(app)
      .get("/api/articlezzzz")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
})


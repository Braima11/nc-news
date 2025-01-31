const endpointsJson = require("../endpoints.json");
const db = require ("../db/connection")
const request = require("supertest")
const app = require("../app");
const testdata = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed");
const sorted  = require('jest-sorted');
const users = require("../db/data/test-data/users");

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
      expect(body.topics.length).toBe(3)
      expect(body.topics[0]).toMatchObject( { slug: 'mitch', description: 'The man, the Mitch, the legend' })
      body.topics.forEach((topic)=>{
        expect(topic).toHaveProperty("slug")
        expect(topic).toHaveProperty("description")
      })
      
    })

  })
})

describe("bad request  for api/topics",()=>{
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
    const articleId = 1
    return request(app)
    .get(`/api/articles/${articleId}`)
    .expect(200)
    .then(({body})=>{
      expect(body.article).toHaveProperty("article_id")
      expect(body.article).toHaveProperty("article_img_url")
      expect(body.article).toHaveProperty("author")
      expect(body.article).toHaveProperty("body")
    })
  })

  test ("test for a id request that is out of range", () =>{
    const IdOutOfRange = 60
    return request(app) 
    .get(`/api/articles/${IdOutOfRange}`)
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Article not found with this Id")
    })
  })

  test ("test for an invalid id", () =>{
    const invalidId = "super"
    return request(app) 
    .get(`/api/articles/${invalidId}`)
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
      const keysInArticle= articles.body.articles[12]

      expect(articles.body.articles.length).toBe(13)
      expect(keysInArticle).toHaveProperty("article_id")
      expect(keysInArticle).toHaveProperty("topic")
      expect(keysInArticle).toHaveProperty("author")
      expect(keysInArticle).toHaveProperty("created_at")
      expect(keysInArticle).toHaveProperty("votes")
      expect(keysInArticle).toHaveProperty("article_img_url")
      expect(articles.body.articles).toBeSortedBy('created_at',{descending: true})
      
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

  test("should be able to sort and order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")  
      .expect(200)
      .then(({body}) => {
        expect(body.articles).toBeSortedBy('votes', {ascending: true});
      });
});
test("filters articles by topic query", () => {
  return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
          expect(body.articles).toBeInstanceOf(Array);
          expect(body.articles.length).toBeGreaterThan(0);
          body.articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
          });
      });
});test("404: responds with error for non-existent topic", () => {
  return request(app)
      .get("/api/articles?topic=bananas")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
      });
});

test("400: responds with error for invalid sort_by query", () => {
  return request(app)
    .get("/api/articles?sort_by=bananas")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid sort_by query");
    });
});

test("400: responds with error for invalid order query", () => {
  return request(app)
    .get("/api/articles?order=sideways")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Order must be asc or desc");
    });
});

test("400: responds with error for invalid sort_by and order combination", () => {
  return request(app)
    .get("/api/articles?sort_by=bananas&order=sideways")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Invalid sort_by query");
    });
});


})

describe("GET /api/articles/:article_id/comments", () => {
  test("getting comments from database using the article id", () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toBeInstanceOf(Array);  
        expect(body.comments.length).toBe(2);
        expect(body.comments).toBeSortedBy('created_at', {descending: true});
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
        });
      });
  });

  test("returns empty array for article with no comments", () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toEqual([]);  
      });
  });

  test("404: article does not exist", () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('No articles found');
      });
  });

  test("400: invalid article_id", () => {
    return request(app)
      .get('/api/articles/not-a-number/comments')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Invalid Id Input, Id must be an Integer');
      });
  });
});

describe("/api/articles/:article_id/comments", ()=>{

  test("post a comment using a specific article id", ()=>{
    
    const id = 1
    return request (app)
    .post(`/api/articles/${id}/comments`)
    .send({
      username: "butter_bridge",
      body:"Northcoders Bootcamp"
    })
    .expect(201)
    .then((commentPosted)=>{
      expect(commentPosted.body.comment.author).toBe("butter_bridge")
      expect(commentPosted.body.comment.body).toBe("Northcoders Bootcamp")

    })   
  })

  test("when an article with the provided id cannot be found", ()=>{

    const IdOutOfRange= 50
    return request (app)
    .post(`/api/articles/${IdOutOfRange}/comments`)
    .send({
      username: "butter_bridge",
      body:"Northcoders Bootcamp"
    })
    .expect(404)
    .then((commentPosted)=>{

      expect(commentPosted.body.msg).toBe("Cannot post comment, the article cannot be found with the Id provided")


    })   
  })

  test("test for invalid id", ()=>{
    return request (app)
    .post("/api/articles/super/comments")
    .send({
      username: "butter_bridge",
      body:"Northcoders Bootcamp"
    })
    .expect(404)
    .then((commentPosted)=>{

      expect(commentPosted.body.msg).toBe("Invalid Id Input, Id must be an Integer")

    })   
  })

})

describe("PATCH /api/articles/:article_id", ()=>{

  test("update an article when provided an article_id", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({votes:7})
    .expect(200)
    .then(({body})=>{

    
      expect(body.votes.votes).toBe(107)
    })
  })
  test("update an article when provided a negative vote", ()=>{
    return request(app)
    .patch("/api/articles/1")
    .send({votes:-7})
    .expect(200)
    .then(({body})=>{

     
      expect(body.votes.votes).toBe(93)
    })
  })

  test("test a valid id but outside the range in db", ()=>{
    return request(app)
    .patch("/api/articles/60")
    .send({votes:-7})
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("No votes found to be updated")
    })
  })

  test("test a non- valid id ", ()=>{
    return request(app)
    .patch("/api/articles/ipad")
    .send({votes:-7})
    .expect(404)
    .then(({body})=>{

      expect(body.msg).toBe("Invalid Id Input, Id must be an Integer")
    })
  })
})

describe("DELETE /api/comments/:comment_id",()=>{
  test("delete a comment when passed the comment_id",()=>{
    return request(app)
    .delete("/api/comments/2")
    .expect(204)
    .then(()=>{
      return db.query(
        'SELECT * FROM comments WHERE comment_id = 2'
    )
   })
   .then(({rows})=>{
    expect(rows.length).toBe(0)
   })

  })
  test("test when the id is not an integer", () => {
    return request(app)
        .delete("/api/comments/awesome")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Invalid Id Input, Id must be an Integer");
        });
});
test("valid id but no comment_id that matches it", () => {
  return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({body}) => {
          expect(body.msg).toBe( " comment_id not available cannot delete comment");
      });
});
})

describe("GET /api/users", ()=>{
  test("get users from databse", ()=>{
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(((response)=>{

      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBe(4);

      response.body.users.forEach((user)=>{
        expect(user).toHaveProperty("username")
        expect(user).toHaveProperty("name")
        expect(user).toHaveProperty("avatar_url")
      })

    }))
  })
  test("test for bad path request", ()=>{
    return request (app)
    .get("/api/userz")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Path not found")

    })
  })
})
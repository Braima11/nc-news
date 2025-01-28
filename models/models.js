const db = require("../db/connection")
const endpoints = require("../endpoints.json")



exports.getEndPointInfo =() =>{
   return endpoints
}

exports.getTopicsFromDb = () =>{


    const sqlQuery = `SELECT * FROM topics`
    return db.query(sqlQuery)
    .then((response)=>{
            return response.rows
    })
}

exports.getArticlesById = (id) =>{

    const sqlQuery = `SELECT * FROM articles WHERE article_id =$1`
    return db.query(sqlQuery,[id])
    .then ((article)=>{
        if (article.rows.length ===0) {
            return Promise.reject({status:404,msg: "Article not found with this Id"})
        } else {
            return article.rows
        }
       
    })
  }

  exports.getArticles = () =>{
    const sqlQuery = `SELECT * FROM articles ORDER BY created_at DESC `
    return db.query(sqlQuery)
    .then ((articles)=>{
        const removeBodyObject = articles.rows.map((article)=>{

            delete article.body

            return {
                article_id: article.article_id,
                artitle:article.title,
                topic:article.topic,
                author:article.author,
                created_at:article.created_at,
                votes:article.votes,
                article_img_url:article.article_img_url

            }
        })

        return removeBodyObject
    })
  }



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



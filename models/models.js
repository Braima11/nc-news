const db = require("../db/connection")
const endpoints = require("../endpoints.json")



exports.getEndPointInfo = () => {
    return endpoints
}

exports.getTopicsFromDb = () => {


    const sqlQuery = `SELECT * FROM topics`
    return db.query(sqlQuery)
        .then((response) => {
            return response.rows
        })
}

exports.getArticlesById = (id) => {

    const sqlQuery = `SELECT articles.*,
               COUNT(comments.comment_id) AS comment_count
                FROM articles
                LEFT JOIN comments ON articles.article_id = comments.article_id
                WHERE articles.article_id=$1
                GROUP BY articles.article_id
        `
    return db.query(sqlQuery, [id])
        .then((article) => {
            if (article.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found with this Id" })
            } else {
                return article.rows[0]
            }

        })
}

exports.getArticles = (queries) => {
    const articleColumns = [
        "author",
        "title", 
        "article_id",
        "topic",
        "votes",
        "article_img_url",
        "comment_count",
        "created_at"  
    ];
    
    const sort_by = queries.sort_by || "created_at";
    const order = queries.order || "desc";  
    const orderArray = ["asc", "desc"];
    const topics = queries.topic;
    const args = [];

    if (!articleColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
    }

    if (!orderArray.includes(order)) { 
        return Promise.reject({ status: 400, msg: "Order must be asc or desc" });
    }

    let sqlQuery = `
        SELECT articles.*,
               COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

    if (topics) {
        sqlQuery += ` WHERE articles.topic = $1`;
        args.push(topics);
    }

    sqlQuery += ` GROUP BY articles.article_id
                  ORDER BY ${sort_by} ${order}`;
    
    return db.query(sqlQuery, args)
        .then(({rows}) => {
            if ( rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Topic not found"
                });
            }
            return rows;
        });
};

exports.getCommentsById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "No articles found"
                });
            }
            const sqlQuery = `
                SELECT * FROM comments 
                WHERE article_id = $1 
                ORDER BY created_at DESC`;
            
            return db.query(sqlQuery, [id]);
        })
        .then(({ rows }) => {
          
            return rows;
        });
};

exports.commentPostById = (article_id, author, body) => {
    return db.query("SELECT * FROM articles WHERE article_id=$1", [article_id])
        .then((response) => {
            if (response.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: "Cannot post comment, the article cannot be found with the Id provided"
                });
            }
            const sqlQuery = `INSERT INTO comments 
            (article_id, author, body)
            VALUES ($1, $2, $3)
            RETURNING *`;

        return db.query(sqlQuery, [article_id, author, body])
        })
        .then((response) => {
            return response.rows[0];
        });
        
};

exports.updateVote = (votes, Id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [Id])
        .then((({ rows }) => {

            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No votes found to be updated" })
            }

            const sqlQuery = `UPDATE articles
            SET votes = votes + $1
            WHERE article_id =$2 RETURNING*`
        
                    return db.query(sqlQuery, [votes, Id])
        }))
        .then(({rows}) => {
                    return rows[0]
                })    

}

exports.deleteCommentsById = (id) =>{

    return db.query(`SELECT * FROM comments WHERE comment_id =$1`,[id])
    .then((response)=>{

        if(response.rows.length===0) {
            return Promise.reject({status:404, msg: " comment_id not available cannot delete comment"})
        }

        const sqlQuery = `DELETE FROM comments WHERE comment_id = $1`
        return db.query(sqlQuery,[id])
    })
}

exports.getUsersInDb = ()=>{
    const sqlQuery = `SELECT * FROM users`
    return db.query(sqlQuery)
    .then((response)=>{
        return response.rows
    })
}
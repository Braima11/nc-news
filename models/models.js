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

    const sqlQuery = `SELECT * FROM articles WHERE article_id =$1`
    return db.query(sqlQuery, [id])
        .then((article) => {
            if (article.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found with this Id" })
            } else {
                return article.rows
            }

        })
}

exports.getArticles = () => {
    const sqlQuery = `
        SELECT articles.*, comments.comment_id
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

    return db.query(sqlQuery)
        .then((result) => {

            const articleGroups = result.rows.reduce((acc, curr) => {
                acc[curr.article_id] = acc[curr.article_id] || [];
                acc[curr.article_id].push(curr);
                return acc;
            }, {});

            const articles = Object.values(articleGroups).map(groupedArt => {
                const article = groupedArt[0];

                return {
                    article_id: article.article_id,
                    title: article.title,
                    topic: article.topic,
                    author: article.author,
                    created_at: article.created_at,
                    votes: article.votes,
                    article_img_url: article.article_img_url,
                    comment_count: groupedArt.length
                };
            });

            return articles.sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            );
        });
};

exports.getCommentsById = (id) => {
    const sqlQuery = `SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at DESC`

    return db.query(sqlQuery, [id])
        .then((comments) => {

            if (comments.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "No comment found" })
            } else {

                return comments.rows

            }
        })
}

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
                    console.log(rows)
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
        console.log(response.rows)
        return response.rows
    })
}
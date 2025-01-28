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

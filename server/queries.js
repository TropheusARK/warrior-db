// Connect to postgres using the no-postgres package

const POOL = require('pg').Pool //object that represents the connection 

const pool = new POOL({

    user: 'me',
    host: 'localhost',
    database: 'warriors',
    password: 'password',
    port: 5432
})

//create all the function will be our request handlers in our express server
//get al links from db


//CREATE a new link in db
const createLink = (request, response) => {
    //take the data the user passes us and insert it into our table
    const name = request.body.name
    const URL = request.body.URL
    
    pool.query('INSERT INTO legends (name, URL) VALUES ($1, $2)', [name, URL],
    (error, results) => {
        if (error){
            throw error
        }
    response.status(201).send("Link added with ID: ${results.insertId}")
    })
}


//READ all links from db
const getLinks = (req, res) => {
    //gett all data currently in the database
    pool.query('SELECT * FROM legends ORDER BY id ASC', (error, results) =>{
        if (error){
            console.error('Database query error:', error)
            res.status(500).json({ error: error.message }) //send error response instead of throwing
            return
        }
        res.status(200).json(results.rows) //send back our data as a json with a status code of 200
    })
}


//Update link in the db

//Delete link in db

module.exports = {
    //export objects, functions anything
    getLinks,
    createLink
} 
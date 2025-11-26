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
    const name = request.body.name
    const URL = request.body.URL
    
    console.log('Received POST request:', { name, URL }) // Add logging
    
    pool.query('INSERT INTO legends (name, URL) VALUES ($1, $2) RETURNING *', [name, URL],
    (error, results) => {
        if (error){
            console.error('Database error:', error) // Log error instead of throwing
            response.status(500).json({ error: error.message })
            return
        }
        console.log('Link added successfully:', results.rows[0]) // Add logging
        response.status(201).json({ message: "Link added successfully", link: results.rows[0] })
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
// Connect to postgres using the no-postgres package

const POOL = require('pg').Pool //object that represents the connection 

let poolConfig

console.log('DATABASE_URL exists?', !!process.env.DATABASE_URL)
console.log('DATABASE_URL value:', process.env.DATABASE_URL ? 'SET (hidden for security)' : 'NOT SET')

if (process.env.DATABASE_URL) {
    // Production (Railway) - uses DATABASE_URL automatically provided
    poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
} else {
    // Development (local)
    console.log('Using local database config')
    poolConfig = {
        user: process.env.DB_USER || 'me',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'warriors',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432
    }
}

const pool = new POOL(poolConfig)

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
const updateLink = (request, response) => {
    const id = parseInt(request.params.id)
    const name = request.body.name
    const URL = request.body.URL
    
    console.log('Received PUT request:', { id, name, URL })
    
    pool.query(
        'UPDATE legends SET name = $1, URL = $2 WHERE id = $3 RETURNING *',
        [name, URL, id],
        (error, results) => {
            if (error) {
                console.error('Database error:', error)
                response.status(500).json({ error: error.message })
                return
            }
            if (results.rows.length === 0) {
                response.status(404).json({ error: 'Link not found' })
                return
            }
            console.log('Link updated successfully:', results.rows[0])
            response.status(200).json({ message: "Link updated successfully", link: results.rows[0] })
        }
    )
}

//Delete link in db
const deleteLink = (request, response) => {
    const id = parseInt(request.params.id)
    
    console.log('Received DELETE request for id:', id)
    
    pool.query('DELETE FROM legends WHERE id = $1 RETURNING *', [id],
        (error, results) => {
            if (error) {
                console.error('Database error:', error)
                response.status(500).json({ error: error.message })
                return
            }
            if (results.rows.length === 0) {
                response.status(404).json({ error: 'Link not found' })
                return
            }
            console.log('Link deleted successfully:', results.rows[0])
            response.status(200).json({ message: "Link deleted successfully", link: results.rows[0] })
        }
    )
}

module.exports = {
    //export objects, functions anything
    getLinks,
    createLink,
    updateLink,
    deleteLink
} 
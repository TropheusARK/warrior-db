const express = require('express')

const app = express()

const path = require('path')

const db = require('./queries') //recieving a module export

console.log("This is version 0.2")

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body)
    next()
})

const PORT = 9001

//CRUD - API routes MUST come BEFORE static middleware
app.get('/legends', db.getLinks) //READ this function was exported from queries
app.post('/new', db.createLink) //CREATE
//UPDATE - update data in db
//DELETE = remove data from db

//host react app - This should come AFTER API routes
app.use(express.static(path.resolve(__dirname, '../client/build') ))

//Routes
app.get('/', (req, res) => {
    //we'll do stuff
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

// Starting express on our port
app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}.`) // Fixed template literal
})
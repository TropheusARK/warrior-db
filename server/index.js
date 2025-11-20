const express = require('express')

const app = express()

const path = require('path')

const db = require('./queries') //recieving a module export

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//host react app
app.use(express.static(path.resolve(__dirname, '../client/build') ))

const PORT = 9001

//Routes
app.get('/', (req, res) => {
    //we'll do stuff
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})


//CRUD
app.get('/legends', db.getLinks) //READ this function was exported from queries
app.post('/new', db.createLink) //CREATE
//UPDATE - update data in db
//DELETE = remove data from db

// Starting express on our port
app.listen(PORT, () => {
    console.log('The app is running on port ${PORT}.')
})
const express = require('express')

const app = express()

const path = require('path')

const db = require('./queries') //recieving a module export

const PORT = 9001

//middleware

//host react app
app.use(express.static(path.resolve(__dirname, '../client/build') ))



//Routes
app.get('/', (req, res) => {
    //we'll do stuff
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})


//CRUD
//CREATE --add data to db
//READ - get data from db  
app.get('/legends', db.getLinks) //this function was exported from queries
//UPDATE - update data in db
//DELETE = remove data from db

// Starting express on our port
app.listen(PORT, () => {
    console.log('The app is running on port ${PORT}.')
})
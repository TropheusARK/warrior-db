const express = require('express')

const app = express()

const db = require('./queries') //recieving a module export

const PORT = 9001

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.get('/', (req, res) => {
    //we'll do stuff
    res.send("Hello from the server")
})

app.get('/test', (req, res) =>{
    // do smth with the res
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
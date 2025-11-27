const express = require('express')

const app = express()

const path = require('path')

const db = require('./queries') //recieving a module export

console.log("This is version 1.3")

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
app.put('/legends/:id', db.updateLink) //UPDATE - update data in db
app.delete('/legends/:id', db.deleteLink) //DELETE - remove data from db

// Add this route before the static middleware
app.get('/api/image-proxy', async (req, res) => {
    const imageUrl = req.query.url
    if (!imageUrl) {
        return res.status(400).json({ error: 'URL parameter required' })
    }
    
    try {
        const response = await fetch(imageUrl)
        const buffer = await response.arrayBuffer()
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        
        res.set('Content-Type', contentType)
        res.set('Cache-Control', 'public, max-age=31536000')
        res.send(Buffer.from(buffer))
    } catch (error) {
        console.error('Proxy error:', error)
        res.status(500).json({ error: 'Failed to fetch image' })
    }
})

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
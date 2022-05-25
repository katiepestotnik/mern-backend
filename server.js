require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT

const cors = require('cors')
const morgan = require('morgan')

const URL = process.env.DATABASE_URL

//mongo/mongoose connection
const mongoose = require('mongoose')
const { json } = require('express/lib/response')
//connects to mongo belongs with Schema 
mongoose.connect(URL)
//only for terminal to show connection
mongoose.connection
    .on("open", () => console.log('connected'))
    .on("closed", () => console.log('closed'))
    .on('error', (err)=>console.log(err))

const {Schema, model} = mongoose
//model schema
const PeopleSchema = new Schema({
    name: {type:String, required:true},
    image: String,
    title: String
})
const People = model("People", PeopleSchema)

//middleware
app.use(cors())
app.use(morgan("tiny"))
app.use(express.json())
//seed route
app.get('/people/seed', (req, res) => {
    const people = [
        {name: "Test", image: "TEST", title: 'test'}
    ]
    People.deleteMany({}, (err, data) => {
        People.create(people, (err, data) => {
            res.json(data)
        })
    })
})

app.get("/", (req, res) => {
    res.send("Home route")
})
//index
app.get('/people', async (req, res) => {
    try {
        res.json(await People.find({}))
    }
    catch (err) {
        res.status(400).json(err)
    }
})
//delete
app.delete('/people/:id', async(req, res) => {
    const { id } = req.params
    try {
        res.status(200).json(await People.findByIdAndDelete(id))
    } catch (err) {
        res.status(400).json(err)
    }
})
//update
app.put('/people/:id', async (req, res) => {
    try{
    const {id}=req.params
        res.status(200).json(await People.findByIdAndUpdate(id, req.body, { new: true }))
    } catch (err){
        res.status(400).json(err)
    }
    
})


//create
app.post('/people', async (req, res) => {
    try {
        res.status(200).json(await People.create(req.body))
    } catch (err) {
        res.status(400).json(err)
    }
})
//show
app.get('/people/:id', async (req, res) => {
    const { id } = req.params
    try {
       res.status(200).json(await People.findById(id)) 
    } catch (err){
        res.status(400).json(err)
    }
})

app.listen(PORT,()=> {
    console.log(`${PORT} is listening`)
})
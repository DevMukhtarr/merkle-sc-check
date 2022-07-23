import "dotenv/config";
import  express from 'express'
const app = express()
const PORT = process.env.PORT
import  mainApp from './app.js'

app.get('/', (req, res) =>{
    res.send("Hello")
}) 

app.listen(PORT || 5000, () =>{
    console.log(`App is listening on port ${PORT}`)
})
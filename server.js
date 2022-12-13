const express=require('express')
const app=express()
const dbConfig = require('./config/dbconfig')
const path = require("path");
require('dotenv').config()

const userRoute=require('./routes/userRoute')
const songsRoute=require('./routes/songsRoute')
const adminRoute = require('./routes/adminRoute')
const cors=require('cors')

app.use(express.json())
app.use(cors({
  origin:'*'
}))
dbConfig()


app.use('/api/users', userRoute)
app.use('/api/songs',songsRoute)
app.use('/api/admin',adminRoute)

const port=process.env.PORT||5000

if (process.env.NODE_ENV === "production") {
  //*Set static folder up in production
    app.use(express.static('client/build'));

    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname, 'client', 'build','index.html')));
}

app.listen(port,() => {
    console.log(`node server listening at port no ${port}`)
})

const express = require('express') //getting express library to use express framework
const app = express() // making a express object
const MongoClient = require('mongodb').MongoClient //creating mongodb object and utilizing library
const PORT = 2121 //defining port for server to use
require('dotenv').config() //using dotenv to use environmental variables


let db, //initialzing database variable
    dbConnectionStr = process.env.DB_STRING, //initializing database location string
    dbName = 'todo'  //initialzing database name

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })//connecting to monogo db database
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs') //define the view to be use ejs
app.use(express.static('public'))//allow the server to grab documents from the public folder
app.use(express.urlencoded({ extended: true })) //both are body parser and allow to manipulate the body request
app.use(express.json())


app.get('/',async (request, response)=>{ //retrieving data from the database
    const todoItems = await db.collection('todos').find().toArray() //all items in the todo array
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //all items in the todo array thats not completed
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //allowing to render in the ejs file 
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //route to insert items to the db 
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //insert to database
    .then(result => {
        console.log('Todo Added')
        response.redirect('/') //refresh the page and redirect back to home route
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => { // route when item is check complete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //update it in the database
        $set: {
            completed: true  //update completed in database
          }
    },{
        sort: {_id: -1}, //use if there is no requre in db
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => { //update mark incomplete
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false //update complete to false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => { //delete request 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {  
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{  //tells what port to put server on 
    console.log(`Server running on port ${PORT}`)
})
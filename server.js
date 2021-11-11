const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient



const app = express();
const port = 1234;

MongoClient.connect("mongodb://localhost:27017/MyDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(client => {
        const db = client.db('users-feedbacks')
        const feedbacksCollection = db.collection('feedbacks')

        app.set('view engine', 'ejs')

        app.use(bodyParser.urlencoded({ extended: true }))

        app.listen(port, () => {
            console.log(('listening on 1234'))
        })

        app.get('/', (req, res) => {
            db.collection('feedbacks').find().toArray()
            .then(result => {
                res.render('index.ejs', {feedbacks:result})  
            })
            .catch(error => console.log(error))        
        });

        
        app.post('/feedbacks', (req, res) => {
            feedbacksCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')                
            })
            .catch(error=>console.error(error))
        })        

    }).catch(error => console.error(error))

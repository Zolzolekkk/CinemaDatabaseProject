import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment
/* ************************************************ */
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public')); 
/* ******** */
/* "Routes" */
/* ******** */
app.get('/', async function (request, response) {
    // const MongoCLient = require('mongodb').MongoClient;
    // const client = new MongoClient('mongodb://127.0.0.1:27017');
    // await client.connect();
    // const db = client.db('AGH');
    // const collection = db.collection('students');
    // const students = await collection.find({}).toArray();
    response.render('index');
});
app.get('/submit', function (request, response) {
    const name = request.query.name;
  });

app.post('/', function (request, response) {
    let body = '';

        request.on('data', (chunk) => {
          body += chunk.toString();
        });

        request.on('end', () => {
          console.log(body);
          const formData = new URLSearchParams(body);

          const name = formData.get('name');
          response.render("gh");
          response.end();
        });
});
/* ************************************************ */
app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});

// module.exports = app;
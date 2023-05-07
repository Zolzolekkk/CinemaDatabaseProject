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
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment
/* ************************************************ */
app.use(morgan('dev')); 
app.use(express.json());
/* ******** */
/* "Routes" */
/* ******** */
app.get('/', async function (request, response) {
    const client = new MongoClient('mongodb+srv://bazydanych2023agh:mongodb123@cinema.xo2lkmi.mongodb.net/');
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('films');
    const movies = await collection.find({}).toArray();

    
    response.json(movies);
});



app.post('/', async function (request, response) {
      const client = new MongoClient('mongodb+srv://bazydanych2023agh:mongodb123@cinema.xo2lkmi.mongodb.net/');
      await client.connect();
      const db = client.db('test');
      const collection = db.collection('films');
      const movies = await collection.find({}).toArray();
      console.log(movies);

        request.on('end', () => {
          response.json(movies);
        });
});
/* ************************************************ */
app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});



import supertest from 'supertest';
// This agent refers to PORT where program is runninng.
const server = supertest.agent('http://localhost:8000');

// fetch("localhost:8000/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: "Testowy Film !!!!",
//         director: "Testowy Test",
//         releaseYear: 2021,
//       }),
//     })


    describe('POST /', () => {
        it('responds with JSON data', (done) => {
          server
            .post('/')
            .set('Content-Type', 'application/json')
            .send({
              name: 'Lord of the Rings',
              director: 'Testowy Test',
              releaseYear: 2021,
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.deep.equal({
                message: 'Data received successfully!',
              });
              done();
            }).catch(done);
        });
      });

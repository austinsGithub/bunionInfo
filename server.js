import express from 'express';
//import sqlite from 'sqlite';
const server = express();
const port = 3000;

//middlewares
server.use(express.json())

server.get('/', (req,res) => {

    res.send(' <b>hello</b>')

});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const AuthRouter = require('./routes/AuthRouter');
const DogsRouter = require('./routes/DogRoutes');


require('./models/database')

app.use(express.json())

const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter)
app.use('/dogs', DogsRouter)

app.listen(PORT, () => console.log(`Listening on Port ${PORT}...`))
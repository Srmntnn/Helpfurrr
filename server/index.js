require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const AuthRouter = require('./routes/AuthRouter');
const DogsRouter = require('./routes/DogRoutes');
const jwt = require('jsonwebtoken');


require('./models/database')

app.use(express.json())

const PORT = process.env.PORT || 8080;



// const verifyToken = (req, res, next) => {
//     // console.log(req.headers.authorization);
//     if (!req.headers.authorization) {
//         return res.status(401).send({ message: "unauthorized access" });
//     }
//     const token = req.headers.authorization.split(' ')[1];
//     // console.log(token)
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).send({ message: "token is invalid!" })
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

app.get('/ping', (req, res) => {
    res.send('PONG');
})

// Middlewares

app.use(express.json({ limit: "25mb" }));
app.use((express.urlencoded({ limit: "25mb" })));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

//jwt
// app.post('/jwt', async (req, res) => {
//     const user = req.body
//     const token = jwt.sign(user, process.env.JWT_SECRET, {
//         expiresIn: '24hr'
//     })
//     res.send({ token });
// })

app.use(cors());
app.use('/auth', AuthRouter)
app.use('/dogs', DogsRouter)

app.listen(PORT, () => console.log(`Listening on Port ${PORT}...`))
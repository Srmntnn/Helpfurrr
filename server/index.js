require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const connectCloudinary = require('./config/cloudinary')

const cookieParser = require('cookie-parser');
const AuthRouter = require('./routes/AuthRouter');
const DogsRouter = require('./routes/DogRoutes');
const CampaignRoute = require('./routes/CampaignRoute')
const AdoptionFormRoutes = require('./routes/AdoptionFormRoutes')
const Notifications = require('./routes/NotificationRoute')
const VolunteersRoute = require('./routes/VolunteersRoute')
const DonationRoute = require('./routes/DonationRoutes')
const path = require('path');
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

require('./models/database')

app.use(express.json())

const PORT = process.env.PORT || 8080;


app.get('/ping', (req, res) => {
  res.send('PONG');
})


// Middlewares

app.use(helmet())
app.use(express.json({ limit: "50mb" }));
app.use((express.urlencoded({ extended: true })));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: `${process.env.CLIENT_URL}`, credentials: true }));
app.use(morgan("dev"))

app.use('/auth', AuthRouter)
app.use('/dogs', DogsRouter)
app.use('/form', AdoptionFormRoutes)
app.use('/notification', Notifications)
app.use('/campaigns', CampaignRoute)
app.use('/volunteers', VolunteersRoute)
app.use('/donations', DonationRoute);

app.listen(PORT, () => console.log(`Listening on Port ${PORT}...`))

//jwt
app.post('/jwt', async (req, res) => {
  const user = req.body
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '24hr'
  })
  res.send({ token });
})

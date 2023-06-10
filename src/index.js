const express = require('express')
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express()

//Import Router
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes')
const serviceRoute = require('./routes/serviceRoutes')
    //DB Connect
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connect DB Successfully !!')
    })
    .catch((err) => {
        console.err('Connect DB Fail !!', err)
    })

app.use(cors());
app.use(cookieParser())
app.use(express.json());

//Route Path
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/users', userRoute)
app.use('/api/v1/service', serviceRoute)


app.listen(8080, () => {
    console.log('Server Running ......!')
})
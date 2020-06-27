const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const users = require('./routes/users');
const auth = require('./routes/auth');
const links = require('./routes/links');
const files = require('./routes/files');

const app = express();

const port = process.env.PORT || 4000;

connectDB();
const corsOpts = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOpts));

app.use(express.json());

app.use(express.static("uploads"));

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/links', links);
app.use('/api/files', files);



app.listen(port, '0.0.0.0', () => {
    console.log(`Server working in port ${port}`)
});

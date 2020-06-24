const express = require('express');
const connectDB = require('./config/db');
const users = require('./routes/users');
const auth = require('./routes/auth');
const links = require('./routes/links');
const files = require('./routes/files');

const app = express();

connectDB();

const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/links', links);
app.use('/api/files', files);

app.listen(port, '0.0.0.0');
console.log(`Server working in port ${port}`);
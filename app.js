const express = require('express');
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const apiControllers = require('./controllers/index');
const mongoose = require('mongoose');
const config = require('./config/index')(process.env.NODE_ENV);
const cors = require('cors');

const port = process.env.port || process.env.PORT || 3001;
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(
    config.database, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }
);

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api', apiControllers);

app.use(express.static(path.join(__dirname, '/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.listen(port, () => console.log(`Server started on port: ${port}, en modo ${process.env.NODE_ENV}`));

module.exports = app;

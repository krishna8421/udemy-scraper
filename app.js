const dotenv = require('dotenv');
const express = require('express');
const cors = require("cors");
const bodyParser = require ('body-parser')
const scraper = require('./router/scraper');

const corsOptions = {
    origin: "http://localhost:3000",
};

dotenv.config();
const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/',cors(corsOptions), scraper)



app.listen(port, () => {
    console.log(`Api started at Port:${port}`)
});
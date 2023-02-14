const express = require ('express');
const cors = require ('cors');
const db = require ("./models");



require('dotenv').config();

const app = express();
var corsOptions = {
    origin: "http://localhost:8081"
  };
const port = process.env.PORT || 8080;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello, this is our chatapp" });
});
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

const uri = process.env.ATLAS_URI;
db.mongoose.connect(uri, {useNewUrlParser: true})
    .then(() => {
        console.log("Mongo db connection established successfully");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

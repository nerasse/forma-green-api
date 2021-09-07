//Modules
const express = require("express"); 
const bodyParser = require('body-parser');

//Base de donnée MongoDB
const mongoose = require("mongoose"); 
const url = "mongodb+srv://a:a@maincluster.ywe0x.mongodb.net/forma-green?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;
mongoose
.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connecté à mongoDB !");
  })
  .catch((e) => {
    console.log("Error de connection à la base de données");
    console.log(e);
  });

//init express
const app = express();

//fichier static
app.use(express.static('public'));

//helmet module
const helmet = require('helmet')
app.use(helmet())

//anti DDOS
const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({ // 100 req max par ip chaque 15min
  windowMs: 15*60*1000, 
  max: 100,
  delayMs: 0
});

//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Définition des routeurs
const router = express.Router();
app.use("/user", router);
require(__dirname + "/controllers/user/userController")(router);
app.use("/benevole", router);
require(__dirname + "/controllers/benevole/benevoleController")(router);
app.use("/test", router);
require(__dirname + "/controllers/testController")(router);

//Définition et mise en place du port d'écoute
const port = process.env.PORT || 8800;
app.listen(port, () => console.log(`Listening on port ${port}`));
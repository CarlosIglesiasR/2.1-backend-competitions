const express =  require('express');
const morgan = require ('morgan');
const bodyParser = require ('body-parser');
const app = express();
const cors = require('cors');

//usamos variable de entorno o 4000 por defecto
app.set('port', process.env.PORT || 4000);

app.use(morgan('dev'));

//IMPORTANTE: Estos módulos se utilizan para poder recibir objetos Json en las peticiones de los servicios
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


app.use(require('./routes/users.routes'))


module.exports = app;
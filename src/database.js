const mongoose = require('mongoose');
//No es necesario crear una base de datos para poder conectarse a una, se creará automáticamente
//cuando guardemos algún dato en ella
mongoose.connect('mongodb://localhost/Competitions', {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify : false
})
.then (db => console.log('DB is connected'))
.catch(err => console.log(err))
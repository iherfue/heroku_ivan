var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/dishes'
const bodyParser = require('body-parser')
const Dishe = require('./models/dishes');
const Promotions = require('./models/promotions')

//IMPORTANDO LAS Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var disheRouter = require('./routes/dishe');
var promotionRouter = require('./routes/promotions');
var leadersRouter = require('./routes/leaders');

var app = express();
//Eror en /bin
//var server = app.listen(3000, function(){})
app.use(logger('dev'))
app.use(bodyParser.json())
//REALIZA UN GET DE DISHE

//si no existe la bd la crea
mongoose.connect("mongodb://localhost:27017/dishes", { useNewUrlParser: true })
.then(db => console.log('Base de datos conectada'))
.catch(err => console.log(err));

app.get('/postman/dishes', (req,res) =>{

})

//POST EN POSTMAN

app.post('/postman/dishes', (req, res) => {
  let newDishe = new Dishe(req.body);
  console.log((req.body));
  newDishe.save(newDishe,(err, results) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      console.log('Saved: ', results)
      res.send(results)
    }
  })
})

//Añadir un nuevo comentario al plato para ello hacemos una busqueda según el id del dishe
//y realizamos un push al array comments

app.post('/postman/dishes/:id/comments', (req,res) => {
  const id_dishe = req.params.id;
  Dishe.findById({_id: id_dishe}, function(err,dishe){
    dishe.comments.push(req.body)

    dishe.save((err,results)=>{
      if (err) {
        console.error(err)
        process.exit(1)
      } else {
        console.log('Saved: ', dishe)
        res.send(dishe)
      }
    })

  })
})

app.get('/postman/dishes', (req,res) =>{
  Dishe.find(function(err,dishe){
    res.send(dishe);
  })
})

//Consultar plato por categoria en el método find accedemos a la propiedad category
//con el valor que el usuario le pasa en req.params

app.get('/postman/dishes/category/:nombre', (req,res) =>{
  Dishe.find({ category: req.params.nombre }, function(err,dishe){
    console.log(dishe);
    res.send(dishe);
  })
})


//Consultar los comentarios segun el nombre del plato
app.get('/postman/dishes/comments/:nombre', (req,res) =>{
  Dishe.find({ name: req.params.nombre }, 'comments', function(err,dishe){
    console.log(dishe);
    res.send(dishe);
  })
})

//Busca un plato segun su id y muestra toda su informacion
app.get('/postman/dishes/:id' , (req,res) =>{
  const id_dishe = req.params.id;
  Dishe.findById({_id: id_dishe}, function(err,dishe){
    console.log(dishe);
    res.send(dishe);
  })
})

//Actualiza el plato segun su id
app.put('/postman/dishes/:id',(req,res) =>{
  const id_dishe = req.params.id;
  Dishe.findByIdAndUpdate(id_dishe,req.body,function(err,dishe){
    console.log(dishe);
    res.send(dishe);
  })
})

//Eliminar  el comentario de un plato
app.delete('/postman/dishes/:id/comments/:id_comment',(req,res) =>{
  const id_dishe = req.params.id;
  const id_comments = req.params.id_comment;

  Dishe.findOneAndUpdate({_id: id_dishe}, {$pull:{comments:{_id:id_comments}}},function(err,results){
      if(err){
        console.error(err)
        process.exit(1)
      }
      res.send(results)
  })
})

//Actualizamos un comentario
app.put('/postman/dishes/:id/comments/:id_comment',(req,res) =>{
  const id_dishe = req.params.id;
  const id_comments = req.params.id_comment;

  Dishe.findOneAndUpdate({_id: id_dishe,"comments._id":id_comments}, {$set:{"comments.$": req.body}},function(err,results){
      if(err){
        console.error(err)
        process.exit(1)
      }
      res.send(results)
  })
})

//PROMOCIONES
app.post('/postman/promotions', (req, res) => {
  let newPromotion = new Promotions(req.body);
  console.log((req.body));
  newPromotion.save(newPromotion,(err, results) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      console.log('Saved: ', results)
      res.send(results)
    }
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes del user INTRODUCE LAS URL Y REDIRIGE
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',disheRouter);
app.use('/promotion',promotionRouter);
app.use('/leaders',leadersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000)
module.exports = app;

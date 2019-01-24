const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Dishe = require('../models/dishes');

//Para trabajar mas fácil con las promesas  utilizamos "async / await"
//El operador await es usado para esperar a una Promise para usarlo la funcion tiene que ser async.
//Nos ahorramos escribir una promesa .then(function(){})

//Pagina principal de la aplicacion
router.get('/', async(req, res) =>{
  const dishe = await Dishe.find(); //hasta que await no devuelve el resultado
  res.render('dishe', { dishe});    //el código no seguira ejecutandose, el callback del then se almacena en dishe
});

//BUSCAR POR CATEGORIA
router.get('/category/:nombre', async(req, res) =>{
  const dishe = await Dishe.find({ category: req.params.nombre })
  res.render('dishe', { dishe});
});


//Consultar los Comentarios
router.get('/ver/comentarios/:id', async(req, res) =>{
  const id_dishe = req.params.id;
  const dishe = await Dishe.findById(id_dishe);
  res.render('comments',{dishe , title:"Editar Plato" });
});


//AÑADIR UN NUEVO COMENTARIO
router.get('/add/comentarios/:id', async(req, res) =>{
  const id_dishe = req.params.id;
  const dishe = await Dishe.findById(id_dishe);
  res.render('new_comment',{dishe , title:"Editar Plato" });
});

//Añadir un nuevo comentario (POST)
router.post('/add/comentarios/:id', async (req, res) =>{
  const id_dishe = req.params.id;
  const dishe = await Dishe.findById({_id: id_dishe})

  try{
      dishe.comments.push(req.body)
      dishe.save();
      res.redirect('/dishes');
  }catch(e){
    res.send("Ha ocurrido un error");
    console.log(e);
  }
});

//Editar un comentario realizamos un get para obtener el comentario del plato
router.get('/edit/dishes/:id_dishes/comentarios/:id', async(req, res) =>{
  const id_dishe = req.params.id_dishes;
  const id_comments = req.params.id;
  const dishe = await Dishe.findOne({_id: id_dishe,"comments._id":id_comments});
  res.render('edit_comment',{dishe , title:"Editar Comentario" });
});

//Editar un comentario POST
router.post('/edit/dishes/:id_dishe/comentarios/:id_comment', async(req, res) =>{
  const id_dishes = req.params.id_dishe;
  const id_comments = req.params.id_comment;
  try{
      await Dishe.findOneAndUpdate({_id: id_dishes,"comments._id":id_comments}, {$set:{"comments.$": req.body}});
      res.redirect('/dishes');
  }catch(e){
    res.send("Ha ocurrido un error");
    console.log(e);
  }

});

//Eliminar un comentario
router.get('/delete/dishes/:id_dishe/comentarios/:id_comment', async(req,res) =>{
const id_dishe = req.params.id_dishe;
const id_comments = req.params.id_comment;

  try{
      await Dishe.findOneAndUpdate({_id: id_dishe}, {$pull:{comments:{_id:id_comments}}})
      res.redirect('/dishes/ver/comentarios/'+ id_dishe);
  }catch(e){
    res.send("Ha ocurrido un error");
    console.log(e);
  }
})

//Vistas
router.get('/view', async(req, res) =>{
  const dishe = await Dishe.find();
      console.log(dishe);
      res.render('dishe', {dishe});
});

//Añadir un nuevo plato, creamos la instancia y asignamos los valores del body
router.post('/add', async(req,res)=>{

  let newDishe = new Dishe(
    {name: req.body.name,
     image: req.body.image,
     category: req.body.category,
     label: req.body.label,
     price: req.body.price,
     featured: req.body.featured,
     description: req.body.description,
      comments: [{ratings: req.body.ratings, comment: req.body.comment, author: req.body.author}]}
  );

  try{
      await newDishe.save(newDishe)

    }catch(e){
    console.log(e);
    res.send("Los campos son requeridos");
  }

  res.redirect('/dishes/view');
});


//Editamos el plato

router.get('/edit/:id', async (req,res) =>{
  const id_dishe = req.params.id;
  const dishe = await Dishe.findById(id_dishe);

  res.render('dishe_edit',{dishe , title:"Editar Plato" });
})

router.post('/edit/:id', async (req,res) =>{
  const id_dishe = req.params.id;
  await Dishe.update({_id: id_dishe}, req.body);
  res.redirect('/dishes');

})

//Eliminar un plato

router.get('/delete/:id', async(req,res)=>{
  const id_dishe = req.params.id;
  await Dishe.deleteOne({_id: id_dishe});
  res.redirect('/dishes');
});


module.exports = router;

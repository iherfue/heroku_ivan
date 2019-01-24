const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Leader = require('../models/leaders');

/* GET home page. */
router.get('/', async(req, res) =>{
  const leader = await Leader.find();
  res.render('leaders', { leader});

});


//Añadir un nuevo leader

router.post('/add', async(req,res)=>{

  let newLeaders = new Leader(
    {name: req.body.name,
     image: req.body.image,
     abbr: req.body.abbr,
     designation: req.body.designation,
     featured: req.body.featured,
     description: req.body.description
   }
  );

  try{
     await newLeaders.save(newLeaders)
     res.redirect('/leaders');
    }catch(e){
      console.log(e);
      res.send("Los campos son requeridos");
  }
});

//BUSCAR POR ABBR
router.get('/abbr/:nombre', async (req, res) =>{
  const leader = await Leader.find({ abbr: req.params.nombre });
  res.render('leaders', { leader});
});


//Editar un leader
router.get('/edit/:id_leader', async(req, res) =>{
  const id_leader = req.params.id_leader;
  const leader = await Leader.findById(id_leader);
  res.render('edit_leader',{leader , title:"Editar un Leader" });
});


//Actualizar un leader

router.post('/edit/:id', async (req,res) =>{
  const id_leader = req.params.id;
  await Leader.update({_id: id_leader}, req.body);
  res.redirect('/leaders');
})


//Eliminar

router.get('/delete/:id', async(req,res)=>{
  const id_leader = req.params.id;
  await Leader.deleteOne({_id: id_leader})
  res.redirect('/leaders');
});


module.exports = router;

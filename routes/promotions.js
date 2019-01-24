const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Promotion = require('../models/promotions');

router.get('/', async(req, res) =>{
  const promotion = await Promotion.find();
  Promotion.find();
  res.render('promotion', { promotion});
});

router.get('/label/:nombre', async(req, res) =>{
  Promotion.find({ label: req.params.nombre }, function(err,promotion){
    console.log(promotion);
    res.render('promotion', { promotion});
  })
});

//Añadir una nueva promoción

router.post('/add', async(req,res)=>{

  let newPromotion = new Promotion(
    {name: req.body.name,
     image: req.body.image,
     label: req.body.label,
     price: req.body.price,
     featured: req.body.featured,
     description: req.body.description
   }
  );

  newPromotion.save(newPromotion,(err, results) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      console.log('Saved: ', results)
    }
  })

  res.redirect('/promotion');

});


//Editar una nueva promoción

router.get('/edit/:id_promotion', async(req, res) =>{
    const id_promo = req.params.id_promotion;
    const promotion = await Promotion.findById(id_promo);

  res.render('edit_promotion',{promotion , title:"Editar Promoción" });
});

router.post('/edit/:id_promotion', async (req,res) =>{
  const id_promo = req.params.id_promotion;
  await Promotion.update({_id: id_promo}, req.body);
  res.redirect('/promotion');

})


//Eliminar nueva promoción

router.get('/delete/:id', (req,res)=>{
  const id_promotion = req.params.id;

   Promotion.deleteOne({_id: id_promotion}).exec()
   .then(resutl => {
     res.status(200).json(result);
   })
   .catch(err =>{
     console.log(err);
     res.status(500).json({
       error: err
     });
   });
  res.redirect('/promotion');
});


module.exports = router;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:'Jade Plant',
      category:'Plant',
      description:'Special Feature: Drought Tolerant',
      image:'https://m.media-amazon.com/images/I/61wsWXlRuFL._AC_UL480_FMwebp_QL65_.jpg'
    },
    {
      name:'Bamboo Plant',
      category:'Plant',
      description:'Small:2 Layer Bamboo',
      image:'https://m.media-amazon.com/images/I/41-knssZyGL._AC_UL480_FMwebp_QL65_.jpg'
    },
    {
      name:'Bonsai Live Plants',
      category:'Plant',
      description:'Bonsai is a symbol of wisdom',
      image:'https://m.media-amazon.com/images/I/61hlwq-GRyL._AC_UL480_FMwebp_QL65_.jpg'
    },
    {
      name:'MoneyPlants',
      category:'Plant',
      description:'Survive in low light',
      image:'https://m.media-amazon.com/images/I/61NgqLdwyfL._AC_UL480_FMwebp_QL65_.jpg'
    }
  ]
  res.render('admin/view-products',{admin:true,products})
});

module.exports = router;

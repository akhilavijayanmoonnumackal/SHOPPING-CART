var express = require('express');
const {render, response}=require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');
var productHelper=require('../helpers/product-helpers')


/* GET users listing. */

// router.get('/',function(req,res,next){
//   productHelpers.getAllProducts().then((products)=>{
//     res.render('admin/view-products',{admin:true,products})
//   }) 
// });

router.get('/',function(req,res,next){
     productHelpers.getAllProducts().then((products)=>{
      res.render('admin/admin-login',{admin:true,products})
     })    
  })

router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})

router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.files.Image);
  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render("admin/add-product")
      }else{
        console.log(err);
      }
    })    
  })
})

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')    
    }
  })
})

router.post('/admin/admin-signup', (req, res) => {
  adminHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    
    req.session.admin = response
    req.session.adminLoggedIn = true
    res.redirect('/view-products')
  })
})

// router.post('/admin/admin-signup',(req,res)=>{
//   adminHelpers.doSignup(req.body).then((responce)=>{    
//     res.redirect('/view-products')
//   })
// })

router.get('/admin-signup', (req, res) => {
  res.render('admin/admin-signup')
})

router.get('/view-products',function(req,res,next){
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })  
});

router.post('/admin/admin-login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {      
      req.session.admin = response.admin
      req.session.adminLoggedIn = true
      res.redirect('/admin/view-products')
    } else {
      req.session.adminLoginErr = "Invalid username or password"
      res.redirect('/admin/admin-login')
    }
  })
})

router.post('/admin/admin-signup', (req, res) => {
  adminHelpers.doSignup(req.body).then((response) => {
    console.log(response);    
    req.session.admin = response
    req.session.adminLoggedIn = true
    res.redirect('/admin/view-products')
  })
})

router.get('/all-users',(req,res)=>{
  adminHelpers.getUsers().then((users)=>{
    res.render('admin/all-users',{users,admin:true,admin:req.session.admin})
  })
})


module.exports = router;

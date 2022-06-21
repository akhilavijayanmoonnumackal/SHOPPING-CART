var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
var productHelper=require('../helpers/admin-helpers');
const adminHelpers = require('../helpers/admin-helpers');
const { response } = require('../app');

const verifyLogin = (req, res, next) => {
  if (req.session.adminLoggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    console.log(products)
    res.render('admin/view-products',{admin:true,products})
  })
  
});

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

router.post('/signup', (req, res) => {
  adminHelpers.doSignup(req.body).then((response)=>{
    res.redirect('/admin')
  })  
})

router.get('/signup', (req, res) => {
  res.render('admin/signup',{admin:true,admin:req.session.admin})
})

// router.get('/login', (req, res) => {
//   if (req.session.admin) {
//     res.redirect('/')
//   } else {
//     res.render('user/admin', { "loginErr": req.session.adminLoginErr })
//     req.session.adminLoginErr = false
//   }
// })

router.get('/',(req,res)=>{
  if(req.session.adminLoggedIn){
    let Admin=req.session.admin
    productHelpers.getAllProducts().then((products)=>{
    res.render('admin/admin-products',{admin:true,products,Admin})
  })
  }else{
    res.render('admin/login',{admin:true,loginErr:req.session.adminLoginErr})
    req.session.adminLoginErr=false
  }
  
})


router.post('/login', (req, res) => {
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      productHelpers.getAllProducts().then((products)=>{
      req.session.admin = response.admin
      req.session.admin.loggedIn = true
      res.redirect('/admin')
      })
    } else {
      req.session.adminLoginErr = "Invalid username or password"
      res.redirect('/admin')
    }
  })
})



router.get('/logout', (req, res) => {
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin')
})

module.exports = router;

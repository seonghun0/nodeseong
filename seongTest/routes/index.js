const e = require('express');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const config = require('../config/key')

const { User } = require('../models/User')


router.use(bodyParser.urlencoded({extended:true}));

router.use(bodyParser.json());


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/register', (req, res)=>{
  const user = new User(req.body);

  user.save((err, doc)=>{
    if(err) return res.json({sucess : false, err})
    return res.status(200).json({
      sucess:true
    })
  })
  
  
})

module.exports = router;

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI).then(()=>console.log('MongoDB connexted...'))
  .catch( err => console.log(err));




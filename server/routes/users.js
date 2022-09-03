var express = require('express');
var router = express.Router();
const config = require('../config/key');
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res)=>{
  console.log(req.body)

  const user = new User(req.body);

  user.save()
      .then((doc) => {res.status(200).json({
        success:true
      })})
      .catch((err)=>{console.log(err)})
})

router.post('/login', (req, res)=>{
  //요청된 이메일을 데이터베이스에 있는지 확인한다.
  User.findOne({ email : req.body.email}, (err, user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message : "제공된 이메일에 해당하는 이메일이 없습니다."
      })
    }

  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인하기
    user.comparePassword(req.body.password , (err, isMatch) => {
      if(!isMatch) 
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      //비밀번호가 맞다면 토큰을 생성한다.
      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에?? 쿠키, 로컬스토리지, 세션..

        res.cookie("login_auth", user.token)
        .status(200)
        .json( { loginSuccess : true , userId : user._id })

        })
      })
    })
})

router.post('/auth', auth, (req, res)=>{
  //여기까지 미들웨어를 통과해 오면 authentication이 true이다.
  res.status(200).json({
    _id : req.user._id,
    isAdmin: req.user.role === 0 ? false :true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role
  })
})

router.get('/logout', auth, (req, res)=>{

  User.findOneAndUpdate({_id : req.user._id},
    {token : ""},
    (err, user)=>{
      if(err) return res.json({success:false, err})
      return res.status(200).send({
        success: true
      })
    })
})


module.exports = router;

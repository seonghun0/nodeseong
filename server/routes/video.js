var express = require('express');
var router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

//multer options
let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads');
    },
    filename:(req,file, cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter:(req, file, cb)=>{
        
        const ext = path.extname(file.originalname);
        if(ext !== '.mp4' || ext !== '.png'){
            return cb(res.status(400).end('only jpg,png,mp4 is allowed'), false);
        }
        cb(null,true);
    }
})

const upload = multer({storage:storage}).single("file");

//===================================
//      VIDEO
//===================================

router.post('/uploadfiles', (req, res)=>{

    upload(req,res,err =>{
        if(err){
            return res.json({success:false,err})
        }
        return res.json({success : true , url:res.req.file.path, fileName:res.req.file.filename})
    })
})

router.post('/thumbnail', (req, res)=>{

    //썸네일 생성하고 비디오 러닝타임도 가져오기
    let filepath = ""
    let fileDuration = ""
    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata)
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    })

    //썸네일 생성
    ffmpeg(req.body.url)
    .on('filenames', function(filenames){
        console.log('Will generate' + filenames.join(', '))
        console.log(filenames)

        filepath = "uploads/thumbnails/" + filenames[0]
    })
    .on('end', function(){
        console.log('ScreenShts taken');
        return res.json({success:true,url:filepath, fileDuration:fileDuration })
    })
    .on('error', function(err){
        console.error(err);
        return res.json({success : false, err})
    })
    .screenshots({

        count:3, // 썸네일 3개
        folder:'uploads/thumbnails',
        size:'320x240',
        //'%b' : input base name (확장자 제외 파일이름)
        filename:'thumbnail-%b.png'
    })
    
})

module.exports = router;

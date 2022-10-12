var express = require('express');
var router = express.Router();
const multer = require('multer');
const { Video } = require('./../models/Video');
const { Subscriber } = require('./../models/Subscriber');
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

router.post('/uploadVideo', (req, res)=>{

    //비디오 정보들을 저장한다.
    const video = new Video(req.body);

    video.save((err,doc)=>{
        if(err) return res.json({success:false, err})
        res.status(200).json({success:true})
    })
    

})

//비디오를 db에서 가져와서 클라이언트에 보낸다.
router.get('/getVideos', (req, res)=>{

    Video.find()
        .populate('writer')
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err)
            
            res.status(200).json({success : true, videos})
        })

})

router.post('/getVideoDetail',(req,res)=>{
    Video.findOne({'_id': req.body.videoId})
        .populate('writer')
        .exec((err, videoDetail)=>{
            if(err) return res.status(400).send(err)

            res.status(200).json({success : true , videoDetail})
        })
})

router.post('/getSubscriptionVideos', (req, res)=>{

    //자신의 아이디를 가지고 구독하는 리스트 가져오기
    Subscriber.find({userFrom:req.body.userFrom})
        .exec((err, subscribeInfo)=>{
            if(err) return res.status(400).send(err)
            
            let subscriberUsers = [];

            subscribeInfo.map((subscriber, i)=>{
                subscriberUsers.push(subscriber.userTo);
            })

            //리스트의 비디오를 가져온다.

            Video.find({writer : {$in: subscriberUsers}})
                .populate('writer')
                .exec((err, videos)=>{
                    if(err) return res.status(400).send(err)

                    res.status(200).json({success:true, videos})

                })
            


        })



})

module.exports = router;

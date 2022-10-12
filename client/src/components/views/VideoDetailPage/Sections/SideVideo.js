import axios from 'axios';
import React, { useEffect,useState } from 'react'

function SideVideo() {

    const [sideVideos, setSideVideos] = useState([]);

    useEffect(()=>{
        axios.get('/api/video/getVideos')
        .then(res => {
          if(res.data.success){
            setSideVideos(res.data.videos)
          }else{
            alert('비디오 가져오기를 실패했습니다.')
          }
        })
      }, []/*한번만 사용*/)

      const renderSideVideo = sideVideos.map((video) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));
        
        return <div style={{display:'flex',marginBottom:'1rem',padding:'0 2rem',justifyContent:'space-between'}} key={video._id}>
            <div style={{width:'40%',marginBottom:'1rem'}}>
                <a href={`/video/${video._id}`}>
                    <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="썸네일"></img>
                </a>
            </div>
            <div style={{width:'50%',display:'flex',flexDirection:'column'}}>
                <a href={`/video/${video._id}`}>
                    <span style={{fontSize:'1rem',color:'black'}}>{video.title}</span><br/>
                    <span>{video.writer.name}</span><br/>
                    <span>{video.views}</span><br/>
                    <span>{minutes} : {seconds}</span>
                </a>
            </div>
        </div>
      })

  return (
    <React.Fragment>
        <div style={{marginTop:'3rem'}}></div>
        {renderSideVideo}
    </React.Fragment>
  )
}

export default SideVideo
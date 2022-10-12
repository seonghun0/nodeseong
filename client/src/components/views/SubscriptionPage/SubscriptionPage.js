import React, {useEffect, useState} from 'react'
import Auth from '../../../hoc/auth'
import {Card, Avatar, Col, Typography, Row} from 'antd';
import moment from 'moment';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';

function SubscriptionPage() {

    const { Title } = Typography;
    const { Meta } = Card;
    const [Video, setVideo] = useState([]);

    useEffect(()=>{

        let SubscriptionVariable = {
          userFrom : localStorage.getItem('userId')
        }

        axios.post('/api/video/getSubscriptionVideos', SubscriptionVariable)
        .then(res => {
        if(res.data.success){
            setVideo(res.data.videos)
        }else{
            alert('비디오 가져오기를 실패했습니다.')
        }
        })
    }, []/*한번만 사용*/)

    const renderCards = Video.map((video, index)=>{

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));
    
        return <Col lg={6} md={8} xs={24} key={video._id} >
          <a href={`/video/${video._id}`}>
            <div style={{position:'relative'}}>
              <img style={{width:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt="썸네일"></img>
              <div className='duration'>
                <span>{minutes} : {seconds}</span>
              </div>
            </div>
          </a>
          <br />
            <Meta 
              avatar={
                <Avatar src={video.writer.image} />
              }
              title={video.title}
              description=""
            />
            <span>{video.writer.name}</span>
            <span style={{marginLeft:'3rem'}}>{video.views}views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
        </Col>
         
    
      })

  return (
    <div style={{padding:'0 50px 50px'}}>
        <NavBar/>
        <div style={{textAlign:'center', width:'100%',height:'100%',margin:'3rem auto'}}>
        <Title level={2}>Video View</Title>
        <hr/>
        <Row gutter={[32, 16]}>
          {renderCards}
        </Row>
        
      </div>
    </div>
  )
}

export default Auth(SubscriptionPage, true)
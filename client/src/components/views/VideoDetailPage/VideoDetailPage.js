import React, { useEffect, useState } from 'react'
import Auth from '../../../hoc/auth'
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import NavBar from '../NavBar/NavBar';

function VideoDetailPage(props) {

    const videoId = useParams().videoId //v6라우터사용 props.match.params 대신 useParams
    const variable = {videoId : videoId}
    
    const [VideoDetail, setVideoDetail] = useState([]);
    
    useEffect(()=>{
        axios.post('/api/video/getVideoDetail', variable)
            .then((res=>{
                if(res.data.success){
                    setVideoDetail(res.data.videoDetail)
                    console.log(res.data.videoDetail)
                }else{
                    alert('비디오 가져오기 실패했습니다.')
                }
            }))
    },[])

    const onBackButtonClickhandler=(e)=>{
        window.history.back()
    }

    if(VideoDetail.writer){
        return (
          <div style={{padding:"2rem 2rem"}}>
            <NavBar/>
            <div onClick={onBackButtonClickhandler}>뒤로가기</div>
              <Row gutter={[16,16]}>
                  <Col lg={18} xs={24}>
                      <div style={{width:'100%',padding:'3rem 4rem'}}>
                          <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                      </div>
                      <List.Item
                          actions={[<Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>]}
                      >
                          <List.Item.Meta
                              avatar={<Avatar src={VideoDetail.writer.image} />}
                              title={VideoDetail.writer.name}
                              description={VideoDetail.description}
                          />
      
                      </List.Item>
                      {/* Comment */}
                  </Col>
                  <Col lg={6} xs={24}>
                    <SideVideo />
                  </Col>
              </Row>
      
          </div>
        )
    }else{
        return <div> ...loading</div>
    }

}

export default Auth(VideoDetailPage, null)
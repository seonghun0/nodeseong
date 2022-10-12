import React, { useState } from "react";
import Auth from "../../../hoc/auth";
import { Typography, Button, Form, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

const Title = Typography;
const TextArea = Input;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
  { value: 4, label: "Sports" },
];

function VideoUploadPage() {
  const user = useSelector(state => state.user);
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");
  const [FIlePath, setFIlePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  var navigate = new useNavigate();

  const onTitleHandler = (e) => {
    setVideoTitle(e.target.value);
  };

  const onDescriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  const onPrivateHandler = (e) => {
    setPrivate(e.target.value);
  };

  const onCategoryHandler = (e) => {
    setCategory(e.target.value);
  };

  const onBackButtonClickHandler = (e) => {
    window.history.back();
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios.post("/api/video/uploadfiles", formData, config)
      .then(res =>{
        if(res.data.success){
          console.log(res.data)

          let variable = {
            url : res.data.url,
            fileName : res.data.fileName
          }
          setFIlePath(res.data.url);

          axios.post('/api/video/thumbnail', variable)
            .then(res =>{
              if(res.data.success){
                console.log(res)
                setDuration(res.data.fileDuration)
                setThumbnailPath(res.data.url);

              }else{
                alert('썸네일 생성 실패했습니다.')
              }
            })

        }else{
          console.log(res)
          alert('비디오 업로드에 실패했습니다.')
        }
      })
      .catch(err =>{
        console.log(err)
      })
  };

  const onSubmit = (e) =>{
    e.preventDefault();

    const variable = {
      writer:user.register._id,
      title:VideoTitle,
      description:Description,
      privacy:Private,
      filePath:FIlePath,
      category:Category,
      duration:Duration,
      thumbnail:ThumbnailPath,      
    }
    console.log(variable);
    axios.post('/api/video/uploadVideo', variable)
      .then(res =>{
        if(res.data.success){
          
          message.success('성공적으로 업로드를 했습니다.')

          setTimeout(function(){
            navigate('/')
          },3000)

        }else{
          alert('비디오 업로드에 실패했습니다.');
        }
      })

  }


  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <NavBar/>
      <div
        style={{ textAlign: "left", marginBottom: "2rem" }}
        onClick={onBackButtonClickHandler}
      >
        뒤로가기
      </div>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}> Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 드랍존 */}
          <Dropzone 
          onDrop={onDrop} 
          multiple={false} 
          maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusOutlined type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/* 썸네일 */}
          {ThumbnailPath &&
          <div>
            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="Thumbnail"/>
          </div>
          }
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleHandler} value={VideoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescriptionHandler} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateHandler}>
          {PrivateOptions.map((val, key) => {
            return (
              <option key={key} value={val.value}>
                {val.label}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <select onChange={onCategoryHandler}>
          {CategoryOptions.map((val, key) => {
            return (
              <option key={key} value={val.value}>
                {val.label}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>Submit</Button>
      </Form>
    </div>
  );
}

export default Auth(VideoUploadPage, true);

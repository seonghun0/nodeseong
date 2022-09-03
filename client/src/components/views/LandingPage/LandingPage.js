import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Auth from '../../../hoc/auth'

function LandingPage() {

  let navigate = useNavigate();

  useEffect(()=>{
    axios.get('/api/hello')
    .then(res => console.log(res))
  }, [])

  const onClickHandler = () =>{
    axios.get('/api/users/logout')
      .then(response =>{
        navigate('/loginPage')
      })
  }
  const onLoginkHandler = () =>{
    navigate('/loginPage')
  }
  const onRegistkHandler = () =>{
    navigate('/RegisterPage')
  }

  return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems:'center',
      width:'100%', height:'100vh', flexDirection:'column'
    }}>
      <h2>S T A R T</h2>
      
      <button onClick={onClickHandler}>
        로그아웃
      </button>
      <br/>
      <button onClick={onLoginkHandler}>
        로그인
      </button>
      <br/>
      <button onClick={onRegistkHandler}>
        회원가입
      </button>

    </div>
  )
}

export default Auth(LandingPage,null)
import axios from 'axios'
import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../../_actions/user_action'
import Auth from '../../../hoc/auth'

function LoginPage(props) {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event)=>{
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event)=>{
    setPassword(event.currentTarget.value)
  }
  const onSubmitHandler = (event)=>{
    event.preventDefault();

    console.log('Email',Email);
    console.log('Password',Password);

    let body ={
      email: Email,
      password : Password
    }

    dispatch(loginUser(body))
      .then(response => {
        console.log(response.payload);
        if(response.payload.loginSuccess){
          // props.history.push('/')
          navigate('/')
        }else{
          alert(response.payload.message)
        }
      })

    axios.post('/api/users/login', body)
    .then((res,req)=>{
      console.log('success')
    })
  }

  return (
    <div style={{
      display:'flex', justifyContent:'center', alignItems:'center',
      width:'100%', height:'100vh'
    }}>
      <form style={{display:'flex', flexDirection:'column'}}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}></input>
        <label>Password</label>
        <input type="Password" value={Password} onChange={onPasswordHandler}></input>
        <br/>
        <button>
          Login
        </button>

      </form>


    </div>
  )
}

export default Auth(LoginPage,false)
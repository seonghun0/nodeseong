import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../../_actions/user_action'
import Auth from '../../../hoc/auth'

function RegisterPage(props) {

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [PasswordConfirm, setPasswordConfirm] = useState("")
  const [Name, setName] = useState("")

  const onEmailHandler = (event)=>{
    setEmail(event.currentTarget.value)
  }
  const onNameHandler = (event)=>{
    setName(event.currentTarget.value)
  }
  const onPasswordHandler = (event)=>{
    setPassword(event.currentTarget.value)
  }
  const onPasswordConfirmHandler = (event)=>{
    setPasswordConfirm(event.currentTarget.value)
  }
  const onSubmitHandler = (event)=>{
    event.preventDefault();

    if(Password !== PasswordConfirm){
      return alert('비밀번호가 다릅니다.')
    }

    let body ={
      email: Email,
      name : Name,
      password : Password
    }

    dispatch(registerUser(body))
      .then(response => {
        if(response.payload.success){
          // props.history.push("/loginPage")
          navigate('/loginPage')
        }else{
          alert('Error')
        }
      })
      .catch(err=>console.log(err))
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
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler}></input>
        <label>Password</label>
        <input type="Password" value={Password} onChange={onPasswordHandler}></input>
        <label>PasswordConfirm</label>
        <input type="Password" value={PasswordConfirm} onChange={onPasswordConfirmHandler}></input>
        <br/>
        <button>regist</button>

      </form>


    </div>
  )
}

export default Auth(RegisterPage,false)
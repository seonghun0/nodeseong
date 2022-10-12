import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null)
{
    /*
        null => 아무나 가능
        true => 로그인 한 유저만
        false => 로그인 안한 유저만
    */

    function AuthenticationCheck(props)
    {
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(()=>{

            dispatch(auth()).then((res)=>{
            
                if(!res.payload.isAuth){
                    //로그인 안함
                    if(option){
                        navigate('/loginPage')
                    }
                }else{
                    //로그인한 상태
                    if(adminRoute && !res.payload.isAdmin){
                        navigate('/')
                    }else{
                        if(option === false){
                            navigate('/')
                        }
                    }
                }
            })    
        }, [])

        return (
            <SpecificComponent />
        )
        
    }

    return AuthenticationCheck
}
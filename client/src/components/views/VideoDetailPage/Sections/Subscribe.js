import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(()=>{

        let variable = { userTo : props.userTo}

        axios.post('/api/subscribe/subscribeNumber', variable)
            .then(res=>{
                if(res.data.success){
                    setSubscribeNumber(res.data.subscribeNumber)
                }else{
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })
            
        let subscribeVariable = {userTo: props.userTo, userFrom: localStorage.getItem('userId')}

        axios.post('/api/subscribe/subscribed', subscribeVariable)
            .then(res=>{
                if(res.data.success){
                    setSubscribed(res.data.subscribed)
                }else{
                    alert('정보를 가져올 수 없습니다.')
                }
            })


    })

    const onSubscribe = ()=>{
        
        let subscribedVariable = {
            userTo : props.userTo,
            userFrom : props.userFrom
        }

        if(Subscribed){
            //이미 구독중

            axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(res=>{
                    if(res.data.success){
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독 취소하는데 실패하였습니다.')
                    }
                })


        }else{
            //구독중이 아닐떄
            axios.post('/api/subscribe/subscribe', subscribedVariable)
                .then(res=>{
                    if(res.data.success){
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    }else{
                        alert('구독하는데 실패하였습니다.')
                    }
                })
        }

    }



  return (
    <div>
        <button
        style={{backgroundColor:`${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius:'4px',color:'white',padding:'10px 16px',fontWeight:'500',fontSize:'1rem',textTransform:'uppercase' }}
        onClick={onSubscribe}>
            {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
        </button>
    </div>
  )
}

export default Subscribe
import React, { useState, useEffect } from 'react'
import {Comment, Avatar} from 'antd'
import { useSelector } from 'react-redux';
import axios from 'axios';

function SingleComment(props) {

    const userData = useSelector(state=>state.user);
    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    const onClickReplyOpen = ()=>{
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (e)=>{
        setCommentValue(e.currentTarget.CommentValue)
    }

    const onSubmit = (e)=>{
        e.preventDefault();

        let variable = {
            content:CommentValue,
            writer:userData.register._id,
            postId:props.postId,
            responseTo:props.comment._id
        }

        axios.post('/api/comment/saveComment', variable)
            .then(res=>{
                if(res.data.success){
                    console.log(res.data)

                    props.refreshFunction(res.data.result)
                }else{
                    alert('댓글달기를 실패하였습니다.')
                }
            })

    }

    const actions = [
        <span onClick={onClickReplyOpen}>Reply to</span>
    ]

  return (
    <div>
        <Comment
            actions={actions}
            author={props.comment.writer.name}
            avatar={<Avatar src={props.comment.writer.image} alt/>}
            content={<p>{props.comment.content}</p>}
        />
        {OpenReply &&
            <form style={{display:'flex'}} onSubmit={onSubmit}>
                <textarea style={{width:'100%', borderRadius:'5px'}}
                onChange={onHandleChange}
                value={CommentValue}
                placeholder='코멘트를 작성해 주세요'
                />
                <button style={{width:'20%', height:'50px'}} onClick={onSubmit}>Submit</button>

            </form>
        }
    </div>
  )
}

export default SingleComment
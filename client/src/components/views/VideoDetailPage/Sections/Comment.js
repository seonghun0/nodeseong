import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SingleComment from './SingleComment';

function Comment(props) {

    const videoId = useParams().videoId;
    const userData = useSelector(state=>state.user);
    const [CommentValue, setCommentValue] = useState("");
    const ChangeHandler = (e)=>{
        setCommentValue(e.currentTarget.value);
    }

    const onSubmit = (e)=>{
        e.preventDefault();

        let variable = {
            content:CommentValue,
            writer:userData.register._id,
            postId:videoId
        }

        axios.post('/api/comment/saveComment', variable)
            .then(res=>{
                if(res.data.success){
                    setCommentValue("")
                    props.refreshFunction(res.data.result)
                }else{
                    alert('댓글달기를 실패하였습니다.')
                }
            })

    }

  return (
    <div>
        <span>replies</span>
        <hr/>

        {/* Commnet List */}
        {props.commentLists && props.commentLists.map((comment, index)=>{
            return (!comment.responseTo &&
                <SingleComment refreshFunction={props.refreshFunction} postId={videoId} comment={comment} />
            )
        })}
        
        {/* Root Comment Form */}

        <form style={{display:'flex'}} onSubmit={onSubmit}>
            <textarea style={{width:'100%', borderRadius:'5px'}}
            onChange={ChangeHandler}
            value={CommentValue}
            placeholder='코멘트를 작성해 주세요'
            />
            <button style={{width:'20%', height:'50px'}} onClick={onSubmit}>Submit</button>

        </form>

    </div>
  )
}

export default Comment
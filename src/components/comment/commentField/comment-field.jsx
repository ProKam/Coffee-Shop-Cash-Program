import { useState, useEffect } from 'react'
import style from './comment-field.module.css'
import close from '../../../assets/close.png'
import { getComments } from '../../../utils/get-comments-by-article'

const defaultName = 'Anonimus'

function Comment({id, author, comment, selfremove_func}) {
    
    const remove = () => (selfremove_func(id))
    console.log("comment " + id + " was made")
    return (
        <div className={style.comment}>
            <div className={style.inputInterface}>
            <div className={style.author}>{author}:</div>
            <img
                className={style.remove} 
                src={close} alt="remove"
                onClick={remove}
            />
            </div>
            <div> {comment} </div>
        </div>
    )
}

export function CommentField({isOpen, cardId}) {
    
    const [commentsList, setCommentsList] = useState([])

    useEffect(() => {
        getComments(cardId).then(fetchedData => setCommentsList(fetchedData))
    }, [])

    const [comment, setComment] = useState('')
    const [idGenerator, inc] = useState(commentsList.length)

    const onChange = event => {
        setComment(event.target.value)
    }

    const remove = (id) => {
        console.log("Comment " + id + " is deleted")
        setCommentsList(
            (prev) => (prev.filter(com => com.id !== id))
        )
    }

    const pushComment = () => {
        if (comment === '') return
        console.log("comment "+ idGenerator + " was made")
        setCommentsList([...commentsList, {author: defaultName, articleId: cardId, id: idGenerator, text: comment}])
        inc(old => old + 1)
        setComment('')
    }
    
    const onEnterPress = event => {
        if (event.keyCode === 13 && event.shiftKey === false) {
            event.preventDefault()
            pushComment()
        }
    }

    console.log(commentsList)

    if (!isOpen) {
        return
    }

    return (
        <div className={style.commentField}>
            <div className={style.comments}>
                {commentsList.map((com, index) => {
                    return <Comment key={index}
                        id={com.id}
                        author={com.author}
                        comment={com.text}
                        selfremove_func={remove}
                    />
                }
                )}
            </div>
            <div className={style.inputInterface}>
                <textarea className={style.input} value={comment} onChange={onChange} onKeyDown={onEnterPress}/>
                <button className={style.button} onClick={pushComment}> Send </button>
            </div>
        </div>
    )
}
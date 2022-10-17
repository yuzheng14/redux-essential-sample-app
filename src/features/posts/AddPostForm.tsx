import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "../users/usersSlice";
import { addNewPost } from "./postSlice";

export const AddPostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useAppDispatch();

    const users = useAppSelector(selectAllUsers)
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                await dispatch(addNewPost({ title, content, user: userId })).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
            } catch (err) {
                console.error('Failed to save the post:', err);
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>添加新文章</h2>
            <form>
                <label htmlFor="postTitle">文章标题:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={e => setUserId(e.target.value)}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">内容：</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>保存文章</button>
            </form>
        </section>
    )
}
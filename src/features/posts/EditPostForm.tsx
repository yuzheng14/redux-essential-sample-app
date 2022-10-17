import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { postUpdated, selectPostById } from "./postSlice";

interface RouteParams {
    postId: string,
}

export const EditPostForm = () => {
    // const { postId } = match.params;
    const { postId } = useParams<RouteParams>();
    console.log(postId);


    const post = useAppSelector(state => selectPostById(state, postId));
    // console.log(posts);
    // const post = posts.find(post => post.id === postId);

    const [title, setTitle] = useState(post!.title);
    const [content, setContent] = useState(post!.content);

    const dispatch = useAppDispatch();
    const history = useHistory();

    const onSavePostClicked = () => {
        if (title && content) {
            dispatch(postUpdated({
                id: postId,
                title,
                content,
            }))
            history.push(`/post/${postId}`)
        }
    };

    return (
        <section>
            <h2>编辑文章</h2>
            <form>
                <label htmlFor="postTile">文章标题：</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label htmlFor="postContent">内容：</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
            </form>
            <button type="button" onClick={onSavePostClicked}>
                保存文章
            </button>
        </section>
    )
}
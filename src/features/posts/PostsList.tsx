import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { fetchPosts, Post, selectPostById, SelectPostIds } from "./postSlice";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";
import { RootState } from "../../app/store";
import React, { useEffect } from "react";
import { Spinner } from "../../components/Spinner";

const PostExcerpt: React.FC<{ postId: string }> = ({ postId }) => {
    const post = useAppSelector(state => selectPostById(state, postId)) as Post;
    return (
        <article className="post-excerpt" key={post.id}>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">
                View Post
            </Link>
        </article>
    )
}

export const PostsList = () => {
    const dispatch = useAppDispatch()
    const orderedPostIds = useAppSelector(SelectPostIds)

    const postStatus = useSelector((state: RootState) => state.posts.status)
    const error = useSelector((state: RootState) => state.posts.error)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])

    let content

    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />
    } else if (postStatus === 'successed') {
        content = orderedPostIds.map(postId => {
            return <PostExcerpt key={postId} postId={postId as string} />
        })
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}
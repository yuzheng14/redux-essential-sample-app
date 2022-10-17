import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { PostAuthor } from "./PostAuthor";
import { selectPostById } from "./postSlice";
import { ReactionButtons } from "./ReactionButtons";
import { TimeAgo } from "./TimeAgo";

export const SinglePostPage = ({ match }) => {
    const { postId } = match.params;

    const post = useAppSelector(state => selectPostById(state, postId))

    if (!post) {
        return (
            <section>
                <h2>页面未找到！</h2>
            </section>
        )
    }

    return (
        <section>
            <article className="post">
                <h2>{post.title}</h2>
                <TimeAgo timestamp={post.date} />
                &nbsp;
                <PostAuthor userId={post.user} />
                <p className="post-content">{post.content}</p>
                <ReactionButtons post={post} />
                <Link to={`/editPost/${post.id}`} className="button">
                    Edit Post
                </Link>
            </article>
        </section>
    )
}
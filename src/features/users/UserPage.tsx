import { Link, useParams } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { Post, selectPostsByUser } from "../posts/postSlice"
import { selectUsersById } from "./usersSlice"

export const UserPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>()

    const user = useAppSelector(selectUsersById(userId))

    const postsForUser = useAppSelector(selectPostsByUser(userId)) as Array<Post>
    // const postsForUser = useAppSelector(state => selectPostsByUser(state, userId))
    console.log(postsForUser);

    const postTiles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ))

    return (
        <section>
            <h2>{user!.name}</h2>
            <ul>{postTiles}</ul>
        </section>
    )
}
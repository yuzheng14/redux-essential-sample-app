import { useAppSelector } from "../../app/hooks"
import { selectUsersById } from "../users/usersSlice";

type PostAuthorProps = {
    // 当前 user 的 id
    userId: string,
}

export const PostAuthor: React.FC<PostAuthorProps> = ({ userId }) => {
    const author = useAppSelector(selectUsersById(userId));

    return <span>by {author ? author.name : 'Unknown author'}</span>
}
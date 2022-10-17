import { createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";

import { RootState } from "../../app/store";

export interface Post {
    id: string,
    date: string,
    title: string,
    content: string,
    user: string,
    reactions: {
        thumbsUp: number,
        hooray: number,
        heart: number,
        rocket: number,
        eyes: number,
    }
}

export type Posts = {
    posts: Array<Post>,
    status: 'idle' | 'loading' | 'successed' | 'failed',
    error: string | undefined,
}

const postsAdapter = createEntityAdapter<Post>({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: '',
})

type AddingPost = {
    title: string,
    content: string,
    user: string,
}

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    async (initialPost: AddingPost) => {
        const response = await client.post('/fakeApi/posts', initialPost)
        return response.data
    }
)

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await client.get('/fakeApi/posts')
        return response.data
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postUpdated(state, action) {
            const { id, title, content } = action.payload;
            const existingPost = state.entities[id]
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'successed'
                postsAdapter.upsertMany(state, action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message as string
            })
            .addCase(addNewPost.fulfilled, postsAdapter.addOne)
    },
})

export const { postUpdated, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;

export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: SelectPostIds,
} = postsAdapter.getSelectors<RootState>(state => state.posts)

const selectorPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)

export const selectPostsByUser = (userId: string): (state: RootState) => unknown => {
    return (state: RootState) => selectorPostsByUser(state, userId)
} 
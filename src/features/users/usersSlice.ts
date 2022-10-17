import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../app/store";

interface User {
    id: string,
    name: string,
}

const usersAdapter = createEntityAdapter<User>()

const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await client.get('/fakeApi/users')
        return response.data
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
    },
})

export default usersSlice.reducer;

const { selectAll, selectById } = usersAdapter.getSelectors<RootState>((state) => state.users)

export const selectAllUsers = selectAll

export const selectUsersById = (userId: string) => {
    return (state: RootState) => selectById(state, userId)
}
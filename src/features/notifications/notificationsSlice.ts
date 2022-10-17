import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../app/store";

export interface Notification {
    date: string,
    user: string,
    id: string,
    message: string,
    read: boolean,
    isNew: boolean,
}

export type Notifacations = Array<Notification>;

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (params, { getState }) => {
        const allNotifications = selectAllNotifications(getState() as RootState)
        const [latestNotification] = allNotifications
        const latestTimestamp = latestNotification ? latestNotification : ''
        const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`)
        return response.data
    }
)

const notificationsAdapter = createEntityAdapter<Notification>({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        allNotificationsRead(state) {
            Object.values(state.entities).forEach(
                notification => notification!.read = true
            )
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notifacations>) => {
            Object.values(state.entities).forEach(notification => {
                notification!.isNew = !notification!.read
            })
            action.payload.forEach(notification => {
                notification.read = false
                notification.isNew = true
            })
            notificationsAdapter.addMany(state, action.payload)
        })
    },
})

export default notificationsSlice.reducer

export const { allNotificationsRead } = notificationsSlice.actions

export const { selectAll: selectAllNotifications } = notificationsAdapter.getSelectors<RootState>(state => state.notifications)
import classNames from "classnames"
import { formatDistanceToNow, parseISO } from "date-fns"
import { useLayoutEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectAllUsers } from "../users/usersSlice"
import { allNotificationsRead, Notifacations, selectAllNotifications } from "./notificationsSlice"

export const NotificationsList: React.FC = () => {
    const dispatch = useAppDispatch()
    const notifications: Notifacations = useAppSelector(selectAllNotifications)
    const users = useAppSelector(selectAllUsers)

    useLayoutEffect(() => {
        dispatch(allNotificationsRead())
    })

    const renderedNotifications = notifications.map(notification => {
        const date = parseISO(notification.date)
        const timeAgo = formatDistanceToNow(date)
        const user = users.find(user => user.id === notification.user) || { name: 'Unknown User' }

        const notificationClassname = classNames('notification', {
            new: notification.isNew,
        })

        return (
            <div key={notification.id} className={notificationClassname}>
                <div>
                    <b>{user.name}</b> {notification.message}
                </div>
                <div title={notification.date}>
                    <i>{timeAgo} ago</i>
                </div>
            </div>
        )
    })

    return (
        <section className="notificationsList">
            <h2>Notifications</h2>
            {renderedNotifications}
        </section>
    )
}
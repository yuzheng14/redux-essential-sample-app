import React from "react"
import { Link } from "react-router-dom"
import { fetchNotifications, selectAllNotifications } from "../features/notifications/notificationsSlice"
import { useAppDispatch, useAppSelector } from "./hooks"

export const Navbar = () => {
    const dispatch = useAppDispatch()
    const notifications = useAppSelector(selectAllNotifications)
    const numUnreadNotifications = notifications.filter(n => !n.read).length

    const fetchNewNotifications = () => {
        dispatch(fetchNotifications())
    }

    let unreadNotificationsBadge: React.ReactNode

    if (numUnreadNotifications > 0) {
        unreadNotificationsBadge = <span className="badge">{numUnreadNotifications}</span>
    }

    return (
        <nav>
            <section>
                <h1>Redux Essentials Example</h1>

                <div className="navContent">
                    <div className="navLinks">
                        <Link to="/">文章列表</Link>
                        <Link to="/users">用户列表</Link>
                        <Link to="/notifications">Notifications {unreadNotificationsBadge}</Link>
                    </div>
                    <button className="button" onClick={fetchNewNotifications}>
                        Refresh Notifications
                    </button>
                </div>
            </section>
        </nav>
    )
}

import { formatDistanceToNow, parseISO } from "date-fns";
import React from "react";

type TimeAgeArgs = {
    timestamp: string,
}

export const TimeAgo: React.FC<TimeAgeArgs> = ({ timestamp }) => {
    let timeAgo = '';
    if (timestamp) {
        const date = parseISO(timestamp);
        const timePeriod = formatDistanceToNow(date);
        timeAgo = `${timePeriod} ago`;
    }

    return (
        <span title={timestamp}>
            &nbsp;<i>{timeAgo}</i>
        </span>
    )
}
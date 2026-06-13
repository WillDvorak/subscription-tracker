import { memo, useState } from "react";
import "./SubscriptionItemBar.css";

/**
 *
 * @param {object} props.subInfo -> Object containing: title, price, category,
 *                                      priority, renewCycle, renewDate, color, imgUrl
 * @param {CallbackFunction} props.setSubs -> setSubscriptionsStateVariable
 * @param {CallbackFunction} props.setIsCreating
 *
 * @returns A formatted bar of subscription information
 *  that will get organized by the subscription list
 */
function SubscriptionItemBar(props) {

    const [viewingMore, setViewingMore] = useState(false);

    const { title, price, category, priority, color, imgUrl } = props.subInfo;
    const renewCycle = props.subInfo.renewCycle || props.subInfo.renewCycleTime;
    const renewDate = props.subInfo.renewDate;
    const priorityClass = priority ? `priority-${priority.toLowerCase()}` : "";

    return (
        <div
            className="sub-item"
            onClick={() => setViewingMore(!viewingMore)}
            style={{ "--item-accent": color || "var(--accent)" }}
        >
            {imgUrl ? (
                <img className="sub-item-logo" src={imgUrl} alt={`${title} logo`} />
            ) : (
                <div
                    className="sub-item-logo-fallback"
                    style={{ backgroundColor: color || "var(--accent)" }}
                >
                    {title ? title.charAt(0).toUpperCase() : "?"}
                </div>
            )}

            <div className="sub-item-info">
                <h2 className="sub-item-title">{title}</h2>
                <p className="sub-item-meta">
                    {category || "Uncategorized"}
                    {renewDate ? ` · Renews ${renewDate}` : ""}
                </p>
                {priority && (
                    <span className={`sub-item-priority ${priorityClass}`}>
                        {priority} priority
                    </span>
                )}
            </div>

            <div className="sub-item-price-block">
                <div className="sub-item-price">${price}</div>
                {renewCycle && <p className="sub-item-cycle">{renewCycle}</p>}
            </div>
        </div>
    );
}

export default memo(SubscriptionItemBar);

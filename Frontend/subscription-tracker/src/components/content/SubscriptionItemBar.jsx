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

    const { title, price, category, priority, color } = props.subInfo;
    const renewCycle = props.subInfo.renewCycle || props.subInfo.renewCycleTime;
    const renewDate = props.subInfo.renewDate;
    const priorityClass = priority ? `priority-${priority.toLowerCase()}` : "";

    function formatRenewDate(renewDate) {
        const [year, month, day] = renewDate.split("-");
        const date = new Date(year, month - 1, day);

        const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        }).format(date);

        return formattedDate;
    }

    return (
        <div
            className="sub-item"
            onClick={() => setViewingMore(!viewingMore)}
            style={{ "--item-accent": color || "var(--accent)" }}
        >
            {false ? (
                <img className="sub-item-logo" alt={`${title} logo`} />
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
                {priority && (
                    <span className={`sub-item-priority ${priorityClass}`}>
                        {priority} priority
                    </span>
                )}
            </div>

            <div className="sub-item-col">
                <div className="sub-item-col-label">Category</div>
                <div className="sub-item-col-content">{category}</div>
                <div style={{display: "hidden"}}>secret</div>
            </div>

            <div className="sub-item-col">
                <div className="sub-item-col-label">Next Payment</div>
                <div className="sub-item-col-content">{formatRenewDate(renewDate)}</div>
                <div className="sub-item-col-subcontent">{renewDate.split("-")[0]}</div>
            </div>

            <div className="sub-item-col">
                <div className="sub-item-col-label">Billing Cycle</div>
                <div className="sub-item-col-content">${price}</div>
                <div className="sub-item-col-subcontent">{renewCycle}</div>
            </div>
        </div>
    );
}

export default memo(SubscriptionItemBar);

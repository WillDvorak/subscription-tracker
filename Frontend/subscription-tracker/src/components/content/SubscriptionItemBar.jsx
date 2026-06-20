import { memo, useState } from "react";
import "./SubscriptionItemBar.css";

/**
 *
 * @param {object} props.subInfo -> Object containing: title, price, category,
 *                                      priority, renewCycle, renewDate, color, imgUrl
 * @param {CallbackFunction} props.setSubs -> setSubscriptionsStateVariable
 * @param {CallbackFunction} props.setSelected
 * @param {CallbackFunction} props.setIsEditing
 *
 * @returns A formatted bar of subscription information
 *  that will get organized by the subscription list
 */
function SubscriptionItemBar(props) {

    const [viewingMore, setViewingMore] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const { title, price, category, priority, color, active } = props.subInfo;
    const renewCycle = props.subInfo.renewCycle || props.subInfo.renewCycleTime;
    const renewDate = props.subInfo.renewDate;
    const priorityClass = priority ? `priority-${priority.toLowerCase()}` : "";

    function formatRenewDate(renewDate) {
        const [year, month, day] = renewDate.split("-");
        const date = new Date(year, month - 1, day);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        }).format(date);
    }

    function handleEdit(e) {
        e.stopPropagation();
        props.setSelected(props.subInfo);
        props.setIsEditing(true);
    }

    function handleDeactivate(e) {
        e.stopPropagation();
        props.setSubs((prev) =>
            prev.map((sub) =>
                sub.id === props.subInfo.id
                    ? { ...sub, active: !sub.active }
                    : sub
            )
        );
    }

    function handleDeleteClick(e) {
        e.stopPropagation();
        if (confirmingDelete) {
            props.setSubs((prev) => prev.filter((sub) => sub.id !== props.subInfo.id));
        } else {
            setConfirmingDelete(true);
        }
    }

    function handleCancelDelete(e) {
        e.stopPropagation();
        setConfirmingDelete(false);
    }

    return (
        <div
            className={`sub-item ${active === false ? "sub-item--inactive" : ""}`}
            style={{ "--item-accent": color || "var(--accent)" }}
        >
            {/* Main row — clickable to expand */}
            <div className="sub-item-main" onClick={() => { setViewingMore(!viewingMore); setConfirmingDelete(false); }}>
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
                    <div style={{visibility: "hidden"}}>secret</div>
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

            {/* Expanded actions */}
            {viewingMore && (
                <div className="sub-item-actions">
                    <button className="sub-action-btn sub-action-edit" onClick={handleEdit}>
                        Edit
                    </button>
                    <button
                        className={`sub-action-btn ${active === false ? "sub-action-reactivate" : "sub-action-deactivate"}`}
                        onClick={handleDeactivate}
                    >
                        {active === false ? "Reactivate" : "Deactivate"}
                    </button>
                    <div className="sub-action-delete-group">
                        {confirmingDelete && (
                            <button className="sub-action-btn sub-action-cancel" onClick={handleCancelDelete}>
                                Cancel
                            </button>
                        )}
                        <button
                            className={`sub-action-btn ${confirmingDelete ? "sub-action-confirm" : "sub-action-delete"}`}
                            onClick={handleDeleteClick}
                        >
                            {confirmingDelete ? "Confirm Delete" : "Delete"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(SubscriptionItemBar);

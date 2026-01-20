import "./css/notification.css";

const failKeywords = ["fail", "invalid"];
function isFail(text) {
    const textLower = text.toLowerCase();
    for (const keyword of failKeywords) {
        if (textLower.includes(keyword.toLowerCase())) return true;
    }
    return false;
}

export default function Notification({ text }) {
    if (!text || text.length === 0) return null;
    const color = isFail(text) ? "red" : "green";
    return (
        <h2 className="notification" style={{"--notification-color": color}}>{text}</h2>
    )
}

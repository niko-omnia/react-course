import "./Notification.css"

const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <p className={className}>{message}</p>
  )
}

export default Notification

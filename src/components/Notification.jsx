import { useEffect } from "react";
import { useNotification } from "../contexts/NotificationContext";
import styles from "./Notification.module.css";

function Notification() {
  const { notifications, removeNotification } = useNotification();

  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => removeNotification(n.id), 2000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((n) => (
        <div key={n.id} className={`${styles.notification} ${styles[n.type]}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default Notification;

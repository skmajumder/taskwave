import { app, db, messaging } from "../../firebase/firebase.config.js";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getToken } from "firebase/messaging";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsCollection = collection(db, "notifications");
    const notificationsQuery = query(
      notificationsCollection,
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => doc.data());
      setNotifications(newNotifications);
    });

    // Get the FCM token for the user
    getToken(messaging, { vapidKey: import.meta.env.VITE_VAPIDKEY })
      .then((currentToken) => {
        if (currentToken) {
          console.log("FCM token:", currentToken);
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((error) => {
        console.log("An error occurred while retrieving the FCM token:", error);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <p>{notification.message}</p>
          <p>Task ID: {notification.taskId}</p>
          <p>Recipient: {notification.recipient}</p>
          <p>Timestamp: {notification.timestamp}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;


import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {useState, useEffect} from "react";
import { apiFetch } from '@/lib/api';
import NotificationPopSmall from './NotificationPopSmall';

export default function NotificationBell(){
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() =>{
        getNotifications();
    }, []);
    const getNotifications = async()=>{
      try{
         setLoading(true);
          const res = await apiFetch('/notification');
          if(!res){
            console.log("Error fetching notifications RES: ", {res});
          }
          console.log(res.notifications);
          setNotifications(res.notifications);
      }catch(err){ console.log(err);}
      finally{
        setLoading(false);
      }
    }
    const onButtonClick = async ()=>{
      if(!showNotifications){
        await getNotifications();      
      }
      setShowNotifications(!showNotifications);
    }
    return(

    <div className="position-relative d-inline-block">
      <Button variant="primary" onClick={onButtonClick}>
        Notifications <Badge bg="secondary">{notifications.length}</Badge>
        <span className="visually-hidden">unread messages</span>
      </Button>

      {showNotifications && (
        <div
          className="position-absolute bg-white border rounded shadow-sm mt-2"
          style={{
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
            right: 0,
          }}
        >
          {loading ? (
            <div className="p-3 text-center text-muted">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-3 text-center text-muted">No notifications</div>
          ) : (
            notifications.map((n, idx) => (
              <NotificationPopSmall
                key={idx}
                from={n.from}
                message={n.message}
                timestamp={n.timestamp}
                seen={n.seen}
                type={n.type}
                notificationId={n._id}
              />
            ))
          )}
        </div>
      )}
    </div>

  
    )
}
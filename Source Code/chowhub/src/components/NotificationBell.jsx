
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
      
      <Button   variant="outline-light" onClick={onButtonClick}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>

        Notifications <Badge bg="secondary">{notifications.length}</Badge>
        <span className="visually-hidden">unread messages</span>
</svg>
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
import {useAtom} from 'jotai';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import {useState, useEffect} from "react";

export default function NotificationBell(){
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    
    const getNotifications = async()=>{
      try{

      }catch(err)
    { console.log(err);

    }
    }
    return(
            <Button variant="primary">
      Notifications <Badge bg="secondary">9</Badge>
      <span className="visually-hidden">unread messages</span>
    </Button>
  
    )
}
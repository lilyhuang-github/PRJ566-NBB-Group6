import Badge from 'react-bootstrap/Badge';
export default function NotificationPopSmall({from, message, seen, timestamp, type}){
    const formatTime = new Date(timestamp).toLocaleDateString();
    let typeBadge; 
    if(type == 'user-activated'){
        typeBadge = <div className="mt-1">
          <Badge bg="success" pill>
            {type}
          </Badge>
        </div>;
    }
    else{
        typeBadge = <div className="mt-1">
          <Badge bg="secondary" pill>
            {type}
          </Badge>
        </div>;
    }
  return (
    <div
      className={`d-flex flex-column p-2 border-bottom ${!seen ? "bg-light" : ""} text-dark`}
      style={{ fontSize: "0.9rem" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <strong>{from}</strong>
        <small className="text-muted">{formatTime}</small>
      </div>
      <div className="text">{message}</div>
      {type && (
        typeBadge
      )}
    </div>
  );
}


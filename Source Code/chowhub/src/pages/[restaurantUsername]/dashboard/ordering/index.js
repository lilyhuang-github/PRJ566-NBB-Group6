import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/router";
import { Button, Col, Container, Row } from "react-bootstrap";

export default function OrderingSwitchMenu() {
  const router = useRouter();
  const { restaurantUsername } = router.query;
  return (
    <DashboardLayout>
      <Container fluid>
        <Row style={{ height: "50vh" }}>
          <Col>
            <Button
              variant="dark"
              className="w-100 h-100"
              style={{ "font-size": "xxx-large" }}
              onClick={() => router.push(`/${restaurantUsername}/dashboard/ordering/create-order`)}
            >
              Create Order
            </Button>
          </Col>
          <Col>
            <Button
              variant="dark"
              className="w-100 h-100"
              style={{ "font-size": "xxx-large" }}
              onClick={() => router.push(`/${restaurantUsername}/dashboard/ordering/history`)}
            >
              Order History
            </Button>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
}

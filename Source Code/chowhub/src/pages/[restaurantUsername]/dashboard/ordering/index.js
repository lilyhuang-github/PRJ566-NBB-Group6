import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

export default function OrderingSwitchMenu() {
  const router = useRouter();
  const { restaurantUsername } = router.query;
  return (
    <DashboardLayout>
      Temp
      <Button onClick={() => router.push(`/${restaurantUsername}/dashboard/ordering/create-order`)}>
        Create Order
      </Button>
      <Button>Order History</Button>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";

export default function SupplierManagement() {
  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Supplier Management</h1>
        <p>This page will display Supplier Management.</p>
        {/* Additional components and logic for managing suppliers can be added here */}
      </ManagerOnly>
    </DashboardLayout>
  );
}

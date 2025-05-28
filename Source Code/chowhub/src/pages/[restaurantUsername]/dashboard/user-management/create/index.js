import { apiFetch } from "@/lib/api";
import { useAtomValue, useAtom } from "jotai";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { toast } from "react-toastify";
// import { useAtom } from "jotai";

//to do: refactor code to make forum a component
export default function CreateEmployeeForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emergencyContact: "",
    username: "",
    role: "",
  });
  // const user = useAtomValue(userAtom);
  // const token = useAtomValue(tokenAtom);

  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setForm((prev) => ({ ...prev, [name]: value }));
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const form = e.currentTarget;
    //add validation

    //
    try {
      console.log({ form });
      const res = await apiFetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success(`📩 We have sent a verification email to ${form.email}`, {
        position: "top-center",
        autoClose: 5000,
      });
      console.log(res.message); // Log success message
    } catch (err) {
      console.log(err, "error occured while creating new employee");
    }
  };
  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Create New Employee</h1>
        <>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                required
                name="firstName"
                value={FormData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                required
                name="lastName"
                value={FormData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                required
                name="email"
                value={FormData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmergencyContact">
              <Form.Label>Emergency Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Emergency Contact"
                required
                name="emergencyContact"
                value={FormData.emergencyContact}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formuserName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                required
                name="username"
                value={FormData.username}
                onChange={handleChange}
              />
            </Form.Group>

            <div key={`inline-radio`} className="mb-3">
              <Form.Check
                inline
                label="Staff"
                name="role"
                type="radio"
                id={`inline-radio-1`}
                required
                value={"staff"}
                onChange={handleChange}
              />
              <Form.Check
                inline
                label="Manager"
                name="role"
                type="radio"
                id={`inline-radio-2`}
                required
                value={"manager"}
                onChange={handleChange}
              />
            </div>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </>
      </ManagerOnly>
    </DashboardLayout>
  );
}

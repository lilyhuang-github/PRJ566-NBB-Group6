import { useRouter } from "next/router";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
//future to do: update it to use context rather than router query
//refactor code to make forum a component
export default function EditEmployee() {
  const router = useRouter();
  const [userId, setUserId] = useState();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    status: false,
    phone: "",
    emergencyContact: "",
  });
  //data could be gotten through api end point, but it's also avialable on user managemnet menu
  //data from user-management page:
  /*
                            fullName
                        username
                        email
                        role
                        userStatus
                        phone
                        emergencyContact`
    */
  useEffect(() => {
    if (router.isReady) {
      const { username, fullName, email, role, userStatus, phone, emergencyContact, _id } =
        router.query;
      const [firstName, lastName] = fullName.split(" ");
      //conver user status back into true false
      const trueFalseStatus = userStatus == "Active";
      setFormData({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        status: trueFalseStatus,
        phone: phone,
        emergencyContact: emergencyContact,
      });
      setUserId(_id);
    }
  }, [router.isReady, router.query]);
  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setForm((prev) => ({ ...prev, [name]: value }));
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const form = e.currentTarget;
    //add validation

    //
    try {
      console.log({ formData });
      const res = await apiFetch(`/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success(`📩 We have successfully updated: ${formData.username}`, {
        position: "top-center",
        autoClose: 5000,
      });
      console.log(res.message); // Log success message
    } catch (err) {
      console.log(err, "error occured while updating employee");
    }
  };
  if (!formData)
    return (
      <DashboardLayout>
        <ManagerOnly>
          <h1>Loading User Data...</h1>
        </ManagerOnly>{" "}
      </DashboardLayout>
    );
  return (
    <DashboardLayout>
      <ManagerOnly>
        <>
          <h1>
            Editing Data For: {formData.username} {JSON.stringify(formData)}
          </h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                required
                name="firstName"
                value={formData.firstName}
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
                value={formData.lastName}
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
                value={formData.email}
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
                value={formData.emergencyContact}
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
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>
            <div key={`inline-radio-role`} className="mb-3">
              <Form.Check
                inline
                label="Staff"
                name="role"
                type="radio"
                id={`inline-radio-1`}
                required
                value={"staff"}
                checked={formData.role === "staff"}
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
                checked={formData.role === "manager"}
                onChange={handleChange}
              />
            </div>
            <Form.Check // prettier-ignore
              type="switch"
              id="custom-switch"
              label="Active Status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked.valueOf() })}
              name="status"
            />{" "}
            <br />
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </>
      </ManagerOnly>
    </DashboardLayout>
  );
}

import React, { useEffect, useState } from "react";
import TableData from '../TableData';
import './index.css'; 

const CreateUser = () => {
  const [formData, setFormData] = useState({ name: "", address: "" });
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users-with-addresses");
      const data = await response.json()
      console.log(data)      
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert(data.message);
        setFormData({ name: "", address: "" });
        fetchUsers();
      } else {
        alert("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("An error occurred while creating the user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="create-user-container">
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h2>All Users</h2>
      <TableData users={users} />
    </div>
  );
};

export default CreateUser;

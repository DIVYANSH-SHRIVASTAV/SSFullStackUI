import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    languages: [],
  });
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Toast notification
  const toast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Language options (matching backend enum)
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "French", label: "French" },
  ];

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      toast("error", "Failed to fetch employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5000/api/employees/${editingId}`,
          formData
        );
        setEmployees((prev) =>
          prev.map((emp) => (emp._id === editingId ? res.data : emp))
        );
        setEditingId(null);
        toast("success", `${res.data.name} updated successfully`);
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/employees",
          formData
        );
        setEmployees((prev) => [...prev, res.data]);
        toast("success", `${res.data.name} added successfully`);
      }
      setFormData({ name: "", email: "", mobile: "", languages: [] });
    } catch (err) {
      toast("error", err.response?.data?.message || "Something went wrong");
    }
  };

  // Edit employee
  const handleEdit = (emp) => {
    setFormData({
      name: emp.name,
      email: emp.email,
      mobile: emp.mobile,
      languages: emp.languages,
    });
    setEditingId(emp._id);
  };

  // Delete employee
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        toast("success", "Employee deleted successfully");
      } catch (err) {
        toast("error", err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Employee" : "Add Employee"}
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Mobile:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, mobile: e.target.value }))
            }
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Multi-select languages */}
        <div>
          <label className="block font-medium">Languages:</label>
          <Select
            isMulti
            options={languageOptions}
            value={formData.languages.map((lang) => ({
              value: lang,
              label: lang,
            }))}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                languages: selected.map((opt) => opt.value),
              }))
            }
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select Languages..."
          />
        </div>

        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            editingId ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {editingId ? "Update Employee" : "Save Employee"}
        </button>
      </form>

      {/* Employee list */}
      <h2 className="text-xl font-bold mt-6">Employee List</h2>
      {/* <ul className="mt-2 space-y-2">
        {employees.map((emp) => (
          <li
            key={emp._id}
            className="p-3 border rounded bg-gray-50 flex justify-between"
          >
            <div>
              <p>
                <strong>{emp.name}</strong> ({emp.email})
              </p>
              <p>Mobile: {emp.mobile}</p>
              <p>Languages: {emp.languages.join(", ")}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(emp)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(emp._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul> */}
      <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Mobile</th>
            <th className="py-2 px-4 text-left">Languages</th>
          
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((emp) => (
            <tr key={emp._id} className="hover:bg-gray-100">
              <td className="py-2 px-4">{emp.name}</td>
              <td className="py-2 px-4">{emp.email}</td>
              <td className="py-2 px-4">{emp.mobile}</td>
              <td className="py-2 px-4">{emp.languages.join(" ,")}</td>
                
              <td className="py-2 px-4 space-x-2">
                <button
                  onClick={() => handleEdit(emp)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default App;

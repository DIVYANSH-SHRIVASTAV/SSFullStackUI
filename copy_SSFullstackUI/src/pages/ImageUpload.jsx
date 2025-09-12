import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ImageUpload = () => {
  const [customers, setCustomers] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef();

  const baseUrl = "http://localhost:5000/api/customers";
  const imageUrl = "http://localhost:5000/uploads";

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const res = await axios.get(`${baseUrl}`);
    setCustomers(res.data);
  };

  const resetForm = () => {
    setId(0);
    setName("");
    setEmail("");
    setMobile("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
   
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    if (image) formData.append("image", image);

    if (id) {
       console.log("Updating customer with ID:", id);
      await axios.put(`${baseUrl}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Updated!", "Customer updated successfully.", "success");
    } else {
      console.log("Creating new customer", formData);
      await axios.post(`${baseUrl}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Added!", "Customer added successfully.", "success");
    }

    resetForm();
    loadCustomers();
  };

  const handleEdit = (cus) => {
    setId(cus._id);
    setName(cus.name);
    setEmail(cus.email);
    setMobile(cus.mobile);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axios.delete(`${baseUrl}/${id}`);
      Swal.fire("Deleted!", "Customer deleted.", "success");
      loadCustomers();
    }
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Customers
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
        >
          {id ? "Update Customer" : "Save Customer"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Mobile</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {c.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {c.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {c.mobile}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={`${imageUrl}/${c.image}`}
                      alt={c.name}
                      className="w-16 h-16 rounded-lg object-cover shadow"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImageUpload;

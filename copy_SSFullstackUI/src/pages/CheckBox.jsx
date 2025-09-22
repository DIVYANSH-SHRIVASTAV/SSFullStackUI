import React, { useState } from "react";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    languages: [],
  });

  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => {
        const updatedLanguages = checked
          ? [...prev.languages, value]
          : prev.languages.filter((lang) => lang !== value);
        return { ...prev, languages: updatedLanguages };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = formData;
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      setUsers([...users, formData]);
    }

    setFormData({ name: "", email: "", mobile: "", languages: [] });
  };

  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-center">User Form</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Enter Mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />

          {/* Checkboxes */}
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="English"
                checked={formData.languages.includes("English")}
                onChange={handleChange}
              />
              English
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="Hindi"
                checked={formData.languages.includes("Hindi")}
                onChange={handleChange}
              />
              Hindi
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="French"
                checked={formData.languages.includes("French")}
                onChange={handleChange}
              />
              French
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            {editIndex !== null ? "Update" : "Submit"}
          </button>
        </form>

        {/* User List */}
        {users.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">User List</h3>

            {/* Table (Desktop) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                    <th className="border border-gray-300 px-4 py-2">Mobile</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Languages
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {user.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.email}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.mobile}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.languages.join(", ")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View (Mobile) */}
            <div className="block md:hidden space-y-4">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <p>
                    <span className="font-semibold">Name:</span> {user.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-semibold">Mobile:</span> {user.mobile}
                  </p>
                  <p>
                    <span className="font-semibold">Languages:</span>{" "}
                    {user.languages.join(", ")}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-lg hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;

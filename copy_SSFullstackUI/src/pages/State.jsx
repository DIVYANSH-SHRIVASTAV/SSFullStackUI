import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const State = () => {
  const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);
const [id, setId] = useState(0);
const [name, setName] = useState("");
const [countryId, setCountryId] = useState("");
const baseUrl = "http://localhost:5000/api";
useEffect(() => {
  loadStates();
  loadCountries();
}, []);
const loadCountries = async () => {
  const res = await axios.get(`${baseUrl}/countries`);
  setCountries(res.data);
}
const loadStates = async () => {
  const res = await axios.get(`${baseUrl}/states`);
  setStates(res.data);
};
const toast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
};
const handleSave = async () => {
  if (!name.trim()) {
    toast("warning", "State name is required");
    return;
  }
  if (!countryId) {
    toast("warning", "Please select a country");
    return;
  }

  const data = { name, countryId };
  try {
    if (id === 0) {
      // await axios.post(`${baseUrl}/states`, data);
      // toast("success", "State added");
       const res = await axios.post(`${baseUrl}/states`, data);
      // Add new state directly into React state
      setStates([...states, res.data]);
      toast("success", "State added");
    } else {
      // await axios.put(`${baseUrl}/states/${id}`, data);
      // toast("success", "State updated");
        await axios.put(`${baseUrl}/states/${id}`, data);
      // Update the state in React
      setStates(states.map(s => s._id === id ? { ...s, name, countryId } : s));
      toast("success", "State updated");
    }
    resetForm();
    await loadStates(); // Always reload the full list
  } catch (error) {
    toast("error", "Something went wrong");
  }
};
const handleEdit = (state) => {
  setId(state._id);
  setName(state.name);
  setCountryId(state.countryId.toString());
};
const handleDelete = (stateId) => {
  Swal.fire({
    title: "Delete this state?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it"
  }).then(async (result) => {
    if (result.isConfirmed) {
      // await axios.delete(`${stateUrl}/states${stateId}`);
      await axios.delete(`${baseUrl}/states/${stateId}`);

      toast("success", "State deleted");
      loadStates();
    }
  });
};
const resetForm = () => {
  setId(0);
  setName("");
  setCountryId("");
};

// const loadCountries = async () => {
//   const res = await axios.get(`${baseUrl}/states`);
//   setCountries(res.data);
// }

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage States</h2>

      {/* Input Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter state name"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
        <select
          value={countryId}
          onChange={(e) => setCountryId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-400"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
        >
          {id ? "Update State" : "Save State"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">State Name</th>
            <th className="border border-gray-300 px-4 py-2">Country</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {states.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-4 text-gray-500"
              >
                No states found
              </td>
            </tr>
          ) : (
            states.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{s._id}</td>
                <td className="border border-gray-300 px-4 py-2">{s.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {countries.find((c) => c._id === s.countryId)?.name || ""}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 me-2 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
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
  
  );
}

export default State;



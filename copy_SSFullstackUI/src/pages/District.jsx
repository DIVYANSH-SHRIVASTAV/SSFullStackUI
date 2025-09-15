import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const District = () => {
  const [districts, setDistricts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");

  const baseUrl = "http://localhost:5000/api";

  useEffect(() => {
    loadCountries();
    loadStates();
    loadDistricts();
  }, []);

  const loadCountries = async () => {
    const res = await axios.get(`${baseUrl}/countries`);
    setCountries(res.data);
  };

  const loadStates = async () => {
    const res = await axios.get(`${baseUrl}/states`);
    setStates(res.data);
  };

  const loadDistricts = async () => {
    const res = await axios.get(`${baseUrl}/districts`);
    setDistricts(res.data);
  };

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

  const handleSave = async () => {
    if (!name.trim() || !countryId || !stateId) {
      toast("warning", "All fields are required");
      return;
    }

    const data = {
      id,
      name,
      countryId,
      stateId,
    };

    try {
      if (id === 0) {
        await axios.post(`${baseUrl}/districts`, data);
        toast("success", "District added");
      } else {
        await axios.put(`${baseUrl}/districts/${id}`, data);
        toast("success", "District updated");
      }
      resetForm();
      loadDistricts();
    } catch (err) {
      toast("error", "Something went wrong");
    }
  };

  const handleEdit = (district) => {
    setId(district._id);
    setName(district.name);

    // Handle both raw ID and populated object
    setCountryId(
      typeof district.countryId === "object"
        ? district.countryId._id
        : district.countryId.toString()
    );

    setStateId(
      typeof district.stateId === "object"
        ? district.stateId._id
        : district.stateId.toString()
    );
  };

  const handleDelete = (districtId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${baseUrl}/districts/${districtId}`);
        loadDistricts();
        toast("success", "District deleted");
      }
    });
  };

  const resetForm = () => {
    setId(0);
    setName("");
    setCountryId("");
    setStateId("");
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Districts</h2>

      {/* Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={countryId}
          onChange={(e) => {
            setCountryId(e.target.value);
            setStateId("");
          }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={stateId}
          onChange={(e) => setStateId(e.target.value)}
          disabled={!countryId}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">Select State</option>
          {states
            .filter((s) =>
              countryId
                ? s.countryId.toString() === countryId.toString()
                : true
            )
            .map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
        </select>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="District Name"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          {id ? "Update District" : "Save District"}
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Country</th>
            <th className="border border-gray-300 px-4 py-2">State</th>
            <th className="border border-gray-300 px-4 py-2">District</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {districts.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No districts found
              </td>
            </tr>
          ) : (
            districts.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{d._id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {typeof d.countryId === "object"
                    ? d.countryId.name
                    : countries.find(
                        (c) => c._id.toString() === d.countryId.toString()
                      )?.name || "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {typeof d.stateId === "object"
                    ? d.stateId.name
                    : states.find(
                        (s) => s._id.toString() === d.stateId.toString()
                      )?.name || "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{d.name}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(d)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
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
};

export default District;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Searching = () => {
  const [students, setStudents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [genderId, setGenderId] = useState(0);

  const baseUrl = "http://localhost:5000/api";
  const genders = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" },
  ];

  useEffect(() => {
    loadStudents();
    loadCountries();
    loadStates();
    loadDistricts();
  }, []);

  const resetForm = () => {
    setId(0);
    setName("");
    setEmail("");
    setMobile("");
    setCountryId("");
    setStateId("");
    setDistrictId("");
    setGenderId(0);
    setShowForm(false);
  };
 const handleSubmit = async (e) => {
    e.preventDefault();

    const gender = genders.find((g) => g.id === genderId)?.name || "";

    const payload = {
      name,
      email,
      mobile,
      gender, // "Male", "Female", "Other"
      country: countryId || null,
      state: stateId || null,
      district: districtId || null,
    };

    console.log("Submitting payload:", payload);

    try {
      if (id) {
        await axios.put(`${baseUrl}/students/${id}`, payload);
        Swal.fire("Updated!", "Student record has been updated.", "success");
      } else {
        await axios.post(`${baseUrl}/students`, payload);
        Swal.fire("Added!", "New student has been added.", "success");
      }
      resetForm();
      loadStudents();
    } catch (err) {
      console.error("Error response:", err.response?.data);
      Swal.fire("Error!", err.response?.data?.error || "Something went wrong", "error");
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const payload = {
  //     id,
  //     name,
  //     email,
  //     mobile,
  //     countryId: countryId ? Number(countryId) : null,
  //     stateId: stateId ? Number(stateId) : null,
  //     districtId: districtId ? Number(districtId) : null,
  //     genderId: genderId ? Number(genderId) : null,
  //   };

  //   if (id && id > 0) {
  //     await axios.put(`${baseUrl}/students`, payload);
  //     Swal.fire("Updated!", "Student record has been updated.", "success");
  //   } else {
  //     await axios.post(`${baseUrl}/students`, payload);
  //     Swal.fire("Added!", "New student has been added.", "success");
  //   }

  //   resetForm();
  //   loadStudents();
  // };

  // const handleEdit = (std) => {
  //   setId(std._id);
  //   setName(std.name || "");
  //   setEmail(std.email || "");
  //   setMobile(std.mobile || "");
  //   setCountryId(std.countryId || "");
  //   setStateId(std.stateId || "");
  //   setDistrictId(std.districtId || "");
  //   setGenderId(std.genderId || 0);
  //   setShowForm(true);
  // };
  //   const handleEdit = (std) => {
  //   setId(std._id); // MongoDB uses _id
  //   setName(std.name);
  //   setEmail(std.email);
  //   setMobile(std.mobile);
  //   setCountryId(std.country?._id || "");
  //   setStateId(std.state?._id || "");
  //   setDistrictId(std.district?._id || "");
  //   setGenderId(genders.find((g) => g.name === std.gender)?.id || 0);
  // };
  const handleEdit = (std) => {
  setId(std._id);
  setName(std.name);
  setEmail(std.email);
  setMobile(std.mobile);

  // FIX: directly assign IDs
  setCountryId(std.country?._id || std.country || "");
  setStateId(std.state?._id || std.state || "");
  setDistrictId(std.district?._id || std.district || "");

  setGenderId(genders.find((g) => g.name === std.gender)?.id || 0);
  setShowForm(true);
};

  // const handleDelete = (studentId) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won’t be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "Cancel",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       await axios.delete(`${baseUrl}/students/${studentId}`);
  //       Swal.fire("Deleted!", "Student has been deleted.", "success");
  //       loadStudents();
  //     }
  //   });
  // };
 const handleDelete = (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This record will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${baseUrl}/students/${studentId}`);
        loadStudents();
        Swal.fire("Deleted!", "Student has been deleted.", "success");
      }
    });
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadStudents();
      return;
    }
    const res = await axios.get(`${baseUrl}/students/search?q=${searchTerm}`);
    setStudents(res.data);
  };

  const loadStudents = async () => {
    const res = await axios.get(`${baseUrl}/students`);
    setStudents(res.data);
  };

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Search + Add Button */}
      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 w-1/2">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md"
          >
            Search
          </button>
        </form>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md"
        >
          + Add Student
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[600px]">
            <h2 className="text-xl font-bold mb-4">
              {id ? "Edit Student" : "Add Student"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-lg px-3 py-2 shadow-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-lg px-3 py-2 shadow-sm"
                />
                <input
                  type="text"
                  placeholder="Mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border rounded-lg px-3 py-2 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <select
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  className="border rounded-lg px-3 py-2 shadow-sm"
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
                  className="border rounded-lg px-3 py-2 shadow-sm"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="border rounded-lg px-3 py-2 shadow-sm"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold mr-4">Gender:</label>
                {/* {genders.map((g) => (
                  <label key={g.id} className="mr-4">
                    <input
                      type="radio"
                      name="gender"
                      value={g.id}
                      checked={genderId === g.id}
                      onChange={() => setGenderId(g.id)}
                      className="mr-1"
                    />
                    {g.name}
                  </label>
                ))} */}
                {genders.map((g) => (
                <label key={g.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={g.id}
                    checked={genderId === g.id}
                    onChange={(e) => setGenderId(Number(e.target.value))}
                    className="w-4 h-4"
                  />
                  {g.name}
                </label>
              ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((std) => (
              <tr
                key={std.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{std.name}</td>
                <td className="px-4 py-2">{std.email}</td>
                <td className="px-4 py-2">{std.mobile}</td>
                <td className="px-4 py-2">
                  {countries.find((c) => c._id === std.country)?.name}
                  
                </td>
                <td className="px-4 py-2">
                  {states.find((s) => s._id === std.state)?.name}
                </td>
                <td className="px-4 py-2">
                  {districts.find((d) => d._id === std.district)?.name}
                </td>
                <td className="px-4 py-2">
                  {std.gender}
                </td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(std)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(std.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Searching;

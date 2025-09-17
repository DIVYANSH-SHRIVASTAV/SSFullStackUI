import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const RadioButton = () => {
  const [students, setStudents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [genderId, setGenderId] = useState(0);

  const genders = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" },
  ];

  const baseUrl = "http://localhost:5000/api";

  useEffect(() => {
    loadStudents();
    loadCountries();
    loadStates();
    loadDistricts();
  }, []);

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

  const resetForm = () => {
    setId("");
    setName("");
    setEmail("");
    setMobile("");
    setCountryId("");
    setStateId("");
    setDistrictId("");
    setGenderId(0);
  };

  const handleEdit = (std) => {
    setId(std._id); // MongoDB uses _id
    setName(std.name);
    setEmail(std.email);
    setMobile(std.mobile);
    setCountryId(std.country?._id || "");
    setStateId(std.state?._id || "");
    setDistrictId(std.district?._id || "");
    setGenderId(genders.find((g) => g.name === std.gender)?.id || 0);
  };

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {id ? "Edit Student" : "Add Student"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-blue-300"
          />

          {/* Country */}
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* State */}
          <select
            value={stateId}
            onChange={(e) => setStateId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* District */}
          <select
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Gender */}
          <div className="col-span-2">
            <p className="text-gray-600 font-medium mb-2">Gender</p>
            <div className="flex gap-6">
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
          </div>

          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {id ? "Update Student" : "Save Student"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Country</th>
              <th className="p-3">State</th>
              <th className="p-3">District</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((std, idx) => (
              <tr
                key={std._id}
                className={idx % 2 === 0 ? "bg-gray-200" : "bg-white"}
              >
                <td className="p-3">{std.name}</td>
                <td className="p-3">{std.email}</td>
                <td className="p-3">{std.mobile}</td>
                <td className="p-3">{countries.find(
                        (c) => c._id.toString() === std.country.toString()
                      )?.name || "Unknown"}</td>
                <td className="p-3">{states.find(
                        (c) => c._id.toString() === std.state.toString()
                      )?.name || "Unknown"}</td>
                <td className="p-3">{districts.find(
                        (c) => c._id.toString() === std.district.toString()
                      )?.name || "Unknown"}</td>
                <td className="p-3">{std.gender}</td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(std)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(std._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  No student records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RadioButton;

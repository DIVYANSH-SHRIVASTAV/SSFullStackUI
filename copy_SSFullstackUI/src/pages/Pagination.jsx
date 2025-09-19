
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Pagination = () => {
  const [students, setStudents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // form fields
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [genderId, setGenderId] = useState(0);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [totalRecords, setTotalRecords] = useState(0);

  const baseUrl = "http://localhost:5000/api";
  const genders = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" },
  ];

  const totalPages = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    loadStudents();
    loadCountries();
    loadStates();
    loadDistricts();
  }, [currentPage, pageSize]);
// Download CSV
const handleExport = async () => {
  try {
    const res = await axios.get(`${baseUrl}/students/export`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    Swal.fire("Error!", "Failed to export CSV", "error");
  }
};

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
      gender,
      country: countryId || null,
      state: stateId || null,
      district: districtId || null,
    };
    try {
      if (id) {
        await axios.put(`${baseUrl}/students/${id}`, payload);
        Swal.fire("Updated!", "Student updated successfully", "success");
      } else {
        await axios.post(`${baseUrl}/students`, payload);
        Swal.fire("Added!", "New student added successfully", "success");
      }
      resetForm();
      loadStudents();
    } catch (err) {
      Swal.fire("Error!", err.response?.data?.error || "Something went wrong", "error");
    }
  };

  const handleEdit = (std) => {
    setId(std._id);
    setName(std.name || "");
    setEmail(std.email || "");
    setMobile(std.mobile || "");
    setCountryId(std.country?._id || std.country || "");
    setStateId(std.state?._id || std.state || "");
    setDistrictId(std.district?._id || std.district || "");
    setGenderId(genders.find((g) => g.name === std.gender)?.id || 0);
    setShowForm(true);
  };

  const handleDelete = (studentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This record will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
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
    setTotalRecords(res.data.length);
    setCurrentPage(1);
  };

  const loadStudents = async () => {
    const res = await axios.get(
      `${baseUrl}/students/paginated?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    setStudents(res.data.data);
    setTotalRecords(res.data.totalRecords);
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

  // generate page list with ellipsis
  const getPageList = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "r-ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "l-ellipsis", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "l-ellipsis", currentPage, "r-ellipsis", totalPages);
      }
    }
    return pages;
  };

  const pageList = getPageList();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Search + Add */}
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
      
        <div className="flex gap-3">
    <button
      onClick={handleExport}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md"
    >
      ⬇ Export CSV
    </button>

    <button
      onClick={() => setShowForm(true)}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md"
    >
      + Add Student
    </button>
  </div>
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
                {genders.map((g) => (
                  <label key={g.id} className="mr-4">
                    <input
                      type="radio"
                      name="gender"
                      value={g.id}
                      checked={genderId === g.id}
                      onChange={(e) => setGenderId(Number(e.target.value))}
                      className="mr-1"
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
              <tr key={std._id} className="border-t hover:bg-gray-50 transition">
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
                <td className="px-4 py-2">{std.gender}</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(std)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(std._id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className={`px-3 py-1 rounded-lg ${currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            ◀
          </button>

          {pageList.map((p, idx) =>
            p === "l-ellipsis" || p === "r-ellipsis" ? (
              <span key={p + idx} className="px-3 py-1 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-lg ${currentPage === p
                    ? "bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className={`px-3 py-1 rounded-lg ${currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
          >
            ▶
          </button>

          {/* Page size dropdown */}
          <select
            value={pageSize}
            onChange={(e) => {
              setCurrentPage(1);
              setPageSize(Number(e.target.value));
            }}
            className="ml-4 border rounded px-2 py-1"
          >
            <option value={2}>2 / page</option>   
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>

        </div>
      )}
    </div>
  );
};

export default Pagination;

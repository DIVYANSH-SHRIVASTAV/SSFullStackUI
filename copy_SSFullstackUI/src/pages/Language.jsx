import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";

function Language() {
  const [languages, setLanguages] = useState([]);
const [id, setId] = useState(0);
const [name, setName] = useState("");
const baseUrl = "http://localhost:5000/api";

useEffect(() => {
  loadLanguages();
}, []);
const resetForm = () => {
  setId(0);
  setName("");
};
const loadLanguages = () => {
  axios.get(`${baseUrl}/languages`).then((res) => setLanguages(res.data));
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
const handleSave = () => {
  const data = { id, name };

  if (!name.trim()) {
    toast("warning", "Language name required");
    return;
  }

  if (id === 0) {
    axios.post(`${baseUrl}/languages`, data).then(() => { toast("success", "Language added")
      resetForm();
      loadLanguages();
    });
  } else {
    axios.put(`${baseUrl}/languages/${id}`, data).then(() => { toast("success", "Language updated")
      resetForm();
      loadLanguages();
    });
  }


  
};
const handleEdit = (language) => {
  setId(language._id);
  setName(language.name);

};
const handleDelete = (langId) => {
  Swal.fire({
    title: "Delete language?",
    text: "This cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes"
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`${baseUrl}/languages/${langId}`).then(()=>{toast("success","Language deleted")
         loadLanguages();
      });
     
    }
  });
};

  return (
     <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Languages</h2>

      {/* Input Field */}
      <div className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter language name"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      {/* Save Button */}
      <div className="mb-6 text-center">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Language
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Id</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {languages.length === 0 ? (
            <tr>
              <td
                colSpan="3"
                className="text-center py-4 text-gray-500"
              >
                No languages found
              </td>
            </tr>
          ) : (
            languages.map((lang) => (
              <tr key={lang._id}>
                <td className="border border-gray-300 px-4 py-2">{lang._id}</td>
                <td className="border border-gray-300 px-4 py-2">{lang.name}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(lang)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lang._id)}
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
}

export default Language;



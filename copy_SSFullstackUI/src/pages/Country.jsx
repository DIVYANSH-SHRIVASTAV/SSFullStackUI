import React from 'react'
import { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import axios from 'axios';
const Country = () => {
 
  const [name, setName] = useState("");
  const [countries, setCountries] = useState([]);
  const [id, setId] = useState(0);
  const baseUrlC = "http://localhost:5000/api/countries";
    useEffect(() => {
    loadCountries();
  }, []);
  const handleSave = () => {
    if (name.trim() === "") {
      toast("warning", "Country name required");
      return;
    }
   
    if (id === 0) {
      axios.post(`${baseUrlC}`, {name }).then(() => {
        toast("success", "Country added");
        clearData();
        loadCountries();
      });
    } else {
      axios.put(`${baseUrlC}/${id}`, { name }).then(() => {
        toast("success", "Country updated");
        clearData();
        loadCountries();
      })
    }
  }
    const loadCountries = () => {
      axios.get(`${baseUrlC}`).then((res) =>{
 setCountries(res.data);
      })
     
    }
    const clearData = () => {
      setName("");
      setId(0);
    }
    const editCountry = (country) => {
      setId(country._id);
      setName(country.name);
    }
    const deleteCountry = (countryId) => {
      Swal.fire({
          title: "Delete Country?",
          text: "This cannot be undone!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes"
        }).then((result)=>{
          if(result.isConfirmed){
      axios.delete(`${baseUrlC}/${countryId}`).then(() => {
        toast("success", "Country Deleted")
        clearData();
        loadCountries();
      })}})
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
      })
    };
    return (
      <div className='mx-auto mt-6 p-6 bg-white shadow rounded-lg w-full h-full'>
        <h1 className='text-3xl font-bold mb-5'>Manage Country</h1>
        <div className='mb-4 w-full '>
          <input type="text" value={name} placeholder='Enter the Country name' onChange={(e) => { setName(e.target.value) }} className=' border border-gray-950 py-3 px-2 w-full focus:outline-none transition focus:ring focus:ring-blue-500' />
        </div>
        <div className='mb-6 text-center'>
          <button className='py-2 px-4 transition text-white shadow bg-blue-400 hover:bg-blue-700' onClick={handleSave}>Add Country</button>
        </div>
        <table className='w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-950 px-4 py-2 '>ID</th>
              <th className='border border-gray-950 px-4 py-2 '>Country</th>
              <th className='border  border-gray-950 px-4 py-2 '>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.length === 0 ? (<tr>
              <td
                colSpan="3"
                className="text-center py-4 text-gray-500"
              >
                No Country found
              </td>
            </tr>
            ) : (countries.map((country) => (
              <tr key={country._id}>
                <td className="border border-gray-300 px-4 py-2">{country._id}</td>
                <td className="border border-gray-300 px-4 py-2">{country.name}</td>
                <td className="border  border-gray-300 px-4 py-2 space-x-4">
                  <button className="mr-3 border bg-yellow-400  hover:bg-yellow-500 text-white px-3 py-1 rounded-lg" onClick={()=>editCountry(country)}>EDIT</button>
                  <button className="ml-4 border bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg" onClick={()=>deleteCountry(country._id)}>DELETE</button>
                </td>
              </tr>
            ))

            )
            }

          </tbody>
        </table>
      </div>
    )
  };


  export default Country;

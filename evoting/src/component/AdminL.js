import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../CSS/admin.css"
const AdminL = () => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/auth/admin", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: credentials.email, 
      }),
    });
    
    const json = await response.json();
    console.log(json);
    
    if (json.success) {
      
      localStorage.setItem("token", json.authtoken);
      navigate("/adminpanel");
    } else {
      alert("Invalid credentials", "danger");
    }
  }

  const onChange = (e) => {
    
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='container'>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={credentials.email}
            id="email"
            aria-describedby="emailHelp"
            name="email"
            onChange={onChange}
          />
          <button type="submit" className="ob">Submit</button>
        </div>
        
      </div>
      
    </form>
  )
}

export default AdminL;

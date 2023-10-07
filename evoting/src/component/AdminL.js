import React, { useState }  from 'react'
import { useNavigate } from 'react-router-dom'
import "../CSS/admin.css"
const AdminL = () => {
  let navigate = useNavigate();
  
const [email,setEmail] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/auth/admin", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email }),
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

  

  return (
    <form onSubmit={handleSubmit}>
      <div className='container1'>
        <div>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="email"
            onChange={(e)=>setEmail(e.target.value)}
            
          />
          <button type="submit" className="ob">Submit</button>
        </div>
        
      </div>
      
    </form>
  )
}

export default AdminL;

import {React, useState} from 'react'
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    let navigate = useNavigate();

  const [credentials, setCredentials] = useState({name:"", email:"", password:"", cpassword:"",voterid:"",adharno:""});
  
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, email, password, voterid, adharno } = credentials;

    // Assuming you have an API route for user registration
    const response = await fetch('http://localhost:5000/api/auth/createuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, voterid, adharno })
    });

    if (response.ok) {
      const data = await response.json();
      const { success,_id} = data;

      console.log(data);

      if (success) {
         
        navigate(`/verify/${_id}`); // Navigate with ObjectId
      } else {
        // Handle registration failure
        console.error('Registration failed');
      }
    } else {
      // Handle registration failure
      console.error('Registration failed');
    }
  };
  
  const onChange = (e)=>{
    setCredentials({...credentials,[e.target.name]: e.target.value})
  }
  return (
    <div>
        <div className="container my-3">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            aria-describedby="emailHelp"
            name="name"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            name="email"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="voterid" className="form-label">
            VoterID
          </label>
          <input
            type="text"
            className="form-control"
            id="voterid"
            name="voterid"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="adharno" className="form-label">
            Adhar No.
          </label>
          <input
            type="text"
            className="form-control"
            id="adharno"
            name="adharno"
            onChange={onChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <p>
        Already have an account? <span onClick={() => navigate('/login')}>Login</span>
      </p>
      
    </div>
    </div>
  )
}

export default SignUp
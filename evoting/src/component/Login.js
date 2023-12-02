import { React} from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/login.css"
import { useCredentials } from "../Context/CredentialContext";

const Login = (props) => {
  let navigate = useNavigate();

  const { credentials, setCredentials } = useCredentials();
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    

    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        voterid: credentials.voterid,
        adharno: credentials.adharno,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      navigate("/verify-otp");
    } else {
      props.Showalert("invalid credentials", "danger");
    }


    const responseOTP = await fetch("http://localhost:5000/api/otp/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: credentials.email, purpose: "login" }),
    });
    const jsonOTP = await responseOTP.json();
    if (jsonOTP.success) {
      props.Showalert("OTP sent successfully","success");
    } else {
      props.Showalert("Error sending OTP","warning");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  

 
  return (
    <div >
      <div className="container1">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
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
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={credentials.password}
              name="password"
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
              value={credentials.voterid}
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
              value={credentials.adharno}
              name="adharno"
              onChange={onChange}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        

        <button type="submit" className="ob">
          Submit
        </button>
        <span className="a" onClick={() => navigate('/reset-password')}>
          Forgot Password
        </span>
      </div>
          
         
          
        </form>
      </div>
    </div>
  );
};

export default Login;

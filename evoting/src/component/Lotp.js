import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/otp.css";
import { useCredentials } from "../Context/CredentialContext";

const Lotp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { credentials } = useCredentials();
 
 
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    console.log("Sending OTP:", otpValue);
    const response = await fetch("http://localhost:5000/api/otp/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email:credentials.email, otp: otpValue }),
    });
    console.log(response);
     console.log(credentials.email);
    const json = await response.json();
    console.log(json)
    if (json.success) {
      navigate("/");
    } else {
      alert("Invalid OTP");
    }
  };

  const onChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    

    if (index < inputRefs.length - 1 && e.target.value !== "") {
      inputRefs[index + 1].current.focus();
    }

  };

  const Backspace = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label>Enter OTP:</label>
          {otp.map((digit, index) => (
            <input
              key={index}
              className="b"
              type="text"
              value={digit}
              onChange={(e) => onChange(e, index)}
              onKeyUp={(e) => Backspace(e, index)}
              ref={inputRefs[index]}
              maxLength={1}
              required
            />
          ))}
          <button type="submit" className="ob">
            Submit OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lotp;

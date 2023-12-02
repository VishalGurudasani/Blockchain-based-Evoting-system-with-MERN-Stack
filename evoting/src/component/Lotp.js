import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../CSS/otp.css";
import { useCredentials } from "../Context/CredentialContext";

const Lotp = (props) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const { credentials } = useCredentials();
  const [unlockAnimation, setUnlockAnimation] = useState(false);

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
      body: JSON.stringify({ email: credentials.email, otp: otpValue }),
    });
    console.log(response);
    console.log(credentials.email);
    const json = await response.json();
    console.log(json);
    if (json.success) {
      setUnlockAnimation(true);
     
      props.Showalert("login successfull", "success");
     
      setTimeout(() => {
        navigate("/")
      },1000);
      
      
    } else {
      props.Showalert("Invalid OTP", "danger");
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
    if (e.key === "Backspace" && index > 0 && otp[index] !== "") {
      inputRefs[index + 1].current.focus();
    }
  };

  useEffect(() => {
    if (unlockAnimation) {
      
      const animationTimeout = setTimeout(() => {
        setUnlockAnimation(false);
      }, 1000);
      return () => clearTimeout(animationTimeout);
    }
  }, [unlockAnimation]);

  return (
    <div>
      <div className="lock-container">
        <div className={`${unlockAnimation ? "unlocked" : "locked"}`}>
          <div className="lock">
            <div className="body"></div>
            <div className="arc"></div>
            <div className="keyhole"></div>
          </div>
        </div>
      </div>
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

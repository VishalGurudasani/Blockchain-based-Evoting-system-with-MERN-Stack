import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the backend to send OTP to the provided email
      const response = await fetch('http://localhost:5000/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose:"reset-password"}),
      });

      const data = await response.json();
      if (data.success) {
        setShowOtpForm(true);
        setMessage('OTP sent to your email. Please enter the OTP to reset your password.');
      } else {
        setMessage('Failed to send OTP. Please check your email.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('An error occurred while sending OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      // Send a request to the backend to reset the password using OTP
      const response = await fetch('http://localhost:5000/api/otp/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Password reset successful. You can now log in with your new password.');
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      } else {
        setMessage('Password reset failed. Please check your email and OTP.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred while resetting your password.');
    }
  };

  return (
    <div className='container my-3'>
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      {showOtpForm ? (
        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">
              OTP
            </label>
            <input
              type="text"
              className="form-control"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </form>
      ) : (
        <form onSubmit={handleSendOtp}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send OTP
          </button>
        </form>
      )}
      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default ForgotPassword;

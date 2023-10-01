import React,{useEffect,useState} from 'react';
import {useNavigate,useLocation} from 'react-router-dom';


const EmailVerification = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('_id');

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    // if (!userId) {
    //   setMessage('Invalid verification link.'); 
    //   return;
    // }
    try {
      

      // Make API request to verify email using the token
      fetch(`http://localhost:5000/api/auth/verify?userId=${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Email verification failed.');
          }
          return response.json();
        })
        .then(data => {
          // If email verification is successful, show success message and redirect
          if (data.success) {
            setMessage('Registration successful. Please login.');
            setTimeout(() => {
              navigate('/login'); // Redirect to login page after 2 seconds
            }, 2000);
          } else {
            setMessage('Email verification failed.');
          }
        })
        .catch(error => {
          console.error(error);
          setMessage('An error occurred during email verification.');
        });
    } catch (error) {
      setMessage('Invalid verification link.'); // Handle invalid ObjectId format
    }
  }, [userId, navigate]);
  return (
    <div>
      <h2>Email Verification</h2>
      
        <p>{message}</p>
      
    </div>
  )
}

export default EmailVerification
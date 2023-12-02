// import React,{useEffect,useState} from 'react';
// import {useNavigate,useLocation} from 'react-router-dom';


// const EmailVerification = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const userId = queryParams.get('_id');
//   console.log(userId);
//   console.log(queryParams);

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {

//     // if (!userId) {
//     //   setMessage('Invalid verification link.'); 
//     //   return;
//     // }
//     try {
      

//       // Make API request to verify email using the token
//       fetch(`http://localhost:5000/api/auth/verify?userId=${userId}`)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Email verification failed.');
//           }
//           return response.json();
//         })
//         .then(data => {
         
//           if (data.success) {
//             setMessage('Registration successful. Please login.');
//             setTimeout(() => {
//               navigate('/login'); 
//             }, 2000);
//           } else {
//             setMessage('Email verification failed.');
//           }
//         })
//         .catch(error => {
//           console.error(error);
//           setMessage('An error occurred during email verification.');
//         });
//     } catch (error) {
//       setMessage('Invalid verification link.'); 
//     }
//   }, [userId, navigate]);
//   return (
//     <div>
//       <h2>Email Verification</h2>
      
//         <p>{message}</p>
      
//     </div>
//   )
// }

// export default EmailVerification;
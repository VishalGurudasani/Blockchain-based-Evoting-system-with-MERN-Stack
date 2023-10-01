import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/admin');
  }

  // Check if the user is logged in based on the 'token' in localStorage
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className='container my-3'>
      {isLoggedIn ? (
        <>
          <button className='btn btn-primary mx-3' onClick={handleClick}>isAdmin</button>
          <button className='btn btn-primary' onClick={()=>{navigate('/voting')}}>Voter</button>
        </>
      ) : (
        <p>You need to be logged in to access this page.</p>
      )}
    </div>
  );
}

export default Home;

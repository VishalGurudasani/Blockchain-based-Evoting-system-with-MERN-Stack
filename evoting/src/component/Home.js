import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../CSS/Home.css"

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/admin');
  }

  // Check if the user is logged in based on the 'token' in localStorage
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div >
      <div className="home">
      {isLoggedIn ? (
        <>
          <button className='ob' onClick={handleClick}>isAdmin</button>
          <button className='ob' onClick={()=>{navigate('/voting')}}>Voter</button>
        </>
      ) : (
        <p>You need to be logged in to access this page.</p>
      )}
      </div>
    </div>
  );
}

export default Home;

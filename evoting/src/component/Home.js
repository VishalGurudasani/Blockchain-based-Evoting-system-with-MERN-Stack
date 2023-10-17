import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../CSS/Home.css"
import b3 from "../b3.svg"

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/admin');
  }
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div >
      <img src={b3} alt="Background" />
      <div className="home">
      
      {isLoggedIn ? (
        <>
          <button className='ob' onClick={handleClick}>isAdmin</button>
          <button className='ob' onClick={()=>{navigate('/voting')}}>Voter</button>
        </>
      ) : (
        <>
        
        <p>You need to be logged in to access this page.</p>
        
        </>
      )}
      
      
      </div>
      
      
    </div>
  );
}

export default Home;

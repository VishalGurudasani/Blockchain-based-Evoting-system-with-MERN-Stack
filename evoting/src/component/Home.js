import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin");
  };
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div>
      <div className="home">
        
        {isLoggedIn ? (
          <>
          <div className="home-container  background-image ">
            <div className="s">
            <button className="btn btn-primary " onClick={handleClick}>
              isAdmin
            </button>
            <button
              className="btn btn-primary "
              onClick={() => {
                navigate("/voting");
              }}
            >
              Voter
            </button></div>
            </div>
          </>
        ) : (
          <>
            <div className="font">
              <p className="text-shadow-drop-center  tracking-in-expand ">
                Online Voting
              </p>
              <p className="text-shadow-drop-center  tracking-in-expand ">
                Let's Vote !!!
              </p>
              <p className="text-shadow-drop-center  tracking-in-expand ">Login to Proceed</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

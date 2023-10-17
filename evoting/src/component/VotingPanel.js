import React, { useState, useEffect } from "react";
import "../App.css";
import "../CSS/Voter.css";
import { useCredentials } from "../Context/CredentialContext";
import { useNavigate } from "react-router-dom";

function VotingPanel({ state }) {
  const { contract } = state;
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [candidateDetails, setCandidateDetails] = useState({
    candidateNames: [],
    candidateParties: [],
  });
  const [voterId, setVoterId] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showInput, setShowInput] = useState(true);
  const [submitVote, setSubmitVote] = useState(false);
  const time = 120;
  const [timeInterval, setTimeInterval] = useState(time);
  const [expire, setExpire] = useState(false);

  const { credentials } = useCredentials();

  useEffect(() => {
    if (candidateDetails.candidateNames.length > 0) {
      setSelectedCandidate(0);
    } else {
      setSelectedCandidate(null);
    }
  }, [candidateDetails]);

  const fetchCandidates = async () => {
    try {
      const City = city;
      const details = await contract.getCandidatesInCity(City);
      console.log(details);
      setCandidateDetails({
        candidateNames: details[0],
        candidateParties: details[1],
      });
      setShowInput(false);
      setSubmitVote(true);
    } catch (error) {
      console.error("Error while fetching candidates:", error);
    }
  };

  const recordVote = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/vote/getVoterId/${voterId}`
      );
      if (!response.ok) {
        console.error("VoterId not found.");

        alert("VoterId not found. Please check your voterId.");
        return;
      }

      const data = await response.json();
      console.log(data);

      if (voterId === credentials.voterid && selectedCandidate !== null) {
        const City = city;
        const Index = selectedCandidate;
        const Transaction = await contract.vote(voterId, City, Index);
        
        await Transaction.wait();
        alert("Your vote has been submitted");
      } else {
        alert(
          "Please select a candidate before submitting your vote or check whether your voterid is correct ."
        );
      }
    } catch (error) {
      console.error("Error while recording vote:", error);
    }
  };
  useEffect(() => {
    const VotingTime = setInterval(() => {
      if (timeInterval > 0) {
        setTimeInterval(timeInterval - 1);
      } else {
        setExpire(true);
        clearInterval(VotingTime);
      }
    }, 1000);
    return () => clearInterval(VotingTime);
  }, [timeInterval]);

  useEffect(() => {
    if (timeInterval === 0) {
      setExpire(true);
      
      navigate("/");
    }
  }, [timeInterval]);

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  

  return (
    <div>
      {expire ? (
        <div>
          <h2>Voting time has expired</h2>
        </div>
      ) : (
        <div>
          <div className="clock">
            <h2> Duration: {formatTime(timeInterval)} </h2>
          </div>
          <div className="voter">
            {showInput && (
              <button className="ob visibility" onClick={fetchCandidates}>
                Fetch Candidates
              </button>
            )}
            {showInput && (
              <input
                className="inputfield"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
              />
            )}

            {candidateDetails.candidateNames.length > 0 &&
               (
                <div
                  className={`candidate-list-container ${
                    showInput ? "hide-fetch-candidates" : ""
                  }`}
                >
                  {candidateDetails.candidateNames.map((name, index) => (
                    <div key={index} className="candidate-item">
                      <div className="candidate-image">
                        <img
                          src="https://www.clipartmax.com/png/middle/479-4799725_when-one-person-addresses-another-person-it-should-icon-admin.png"
                          alt="Default Candidate"
                        />
                      </div>
                      <div className="candidate-info">
                        <label>
                          <input
                            type="radio"
                            name="candidateRadio"
                            value={index}
                            checked={selectedCandidate === index}
                            onChange={() => setSelectedCandidate(index)}
                          />
                          {name} ({candidateDetails.candidateParties[index]})
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {submitVote && (
              <div>
                <button className="ob" onClick={recordVote}>
                  Submit Vote
                </button>
                <input
                  className="inputfield"
                  type="text"
                  value={voterId}
                  placeholder="Voter ID"
                  onChange={(e) => setVoterId(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VotingPanel;

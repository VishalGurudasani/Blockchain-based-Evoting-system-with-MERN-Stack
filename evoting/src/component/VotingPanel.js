import React, { useState, useEffect } from "react";
import "../App.css";

function VotingPanel({ state }) {
  const { contract } = state;
  const [city, setCity] = useState("");
  const [candidateIndex, setCandidateIndex] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState({
    candidateNames: [],
    candidateParties: [],
  });
  const [voterId, setVoterId] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    if (candidateDetails.candidateNames.length > 0) {
      // If candidate details are available, select the first candidate by default
      setSelectedCandidate(0);
    } else {
      // Reset the selected candidate if no candidates are available
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
        // If the response status is not OK, handle the error (voterId not found)
        console.error("VoterId not found.");
        // Display an error message or take appropriate action
        alert("VoterId not found. Please check your voterId.");
        return; // Prevent further execution
      }
      const data = await response.json();
      console.log(data);

      if (selectedCandidate !== null) {
        const City = city;
        const Index = selectedCandidate; // Use the selected candidate index
        const Transaction = await contract.vote(voterId, City, Index);
        await Transaction.wait();
        alert("Your vote has been submitted");
      } else {
        alert("Please select a candidate before submitting your vote.");
      }
    } catch (error) {
      console.error("Error while recording vote:", error);
    }
  };

  return (
    <div className="container my-3">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={fetchCandidates}>Fetch Candidates</button>

      {candidateDetails.candidateNames.length > 0 && (
        <div className="container candidate-list">
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

      <div className="container">
        <input
          type="text"
          value={voterId}
          placeholder="Voter ID"
          onChange={(e) => setVoterId(e.target.value)}
        />

        <button onClick={recordVote}>Submit Vote</button>
      </div>
    </div>
  );
}

export default VotingPanel;

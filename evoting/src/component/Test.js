import React, { useState } from 'react';

function Test() {
  const [voterId, setVoterId] = useState('');
  const [fetchedVoterId, setFetchedVoterId] = useState('');
  const [message, setMessage] = useState('');

  const fetchVoterId =async  () => {
    try {
      // Make a GET request to your backend to retrieve the voterId
      const response = await fetch(`http://localhost:5000/api/vote/getVoterId/${voterId}`);

   

      const data = await response.json();

      if (data.voterId) {
        // Update the state with the fetched voter ID
        setFetchedVoterId(data.voterId);
        setMessage(`Fetched Voter ID: ${data.voterId}`);
      } else {
        setMessage('Voter not found');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div>
      <h1>Vote Casting Page</h1>
      <input
        type="text"
        placeholder="Enter Voter ID"
        value={voterId}
        onChange={(e) => setVoterId(e.target.value)}
      />
      <button onClick={fetchVoterId}>Fetch Voter ID</button>
      {message && <p>{message}</p>}
      {fetchedVoterId && <p>Fetched Voter ID: {fetchedVoterId}</p>}
    </div>
  );
}

export default Test;

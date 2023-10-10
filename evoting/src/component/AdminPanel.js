import React, { useState } from "react";
import "../App.css";

const AdminPanel = ({ state }) => {
  const [bDetails, setBDetails] = useState({
    city: "",
    admin: "",
    isOpen: false,
    candidateCount: 0,
  });
  const [cDetails, setCDetails] = useState({
    name: "",
    party: "",
    voteCount: 0,
  });

  const [ballotCity, setBallotCity] = useState("");
  const [candidateCity, setCandidateCity] = useState("");
  const [candidateIndex, setCandidateIndex] = useState("");
  const [city, setCity] = useState("");
  const [close, setClose] = useState();
  const [result, setResult] = useState({
    winnerName: "",
    winnerParty: "",
  });
  const { contract } = state;
  const createBallot = async (event) => {
    try {
      console.log("create ballot");
      event.preventDefault();
      const { contract } = state;
      //    await contract.methods.createBallot().send({from:state})
      const City = document.querySelector("#city").value;
      console.log("City", City);
      //     let city=document.getElementById('#city').val()
      const transaction = await contract.createBallot(City);
      await transaction.wait();
      console.log("ballot created");
    } catch (error) {
      console.log("ballot not created because owner denied the transaction");
    }
  };

  const addCandidate = async (event) => {
    try {
      event.preventDefault();
      console.log("adding Candidate");

      const City = document.querySelector("#city").value;
      const Name = document.querySelector("#name").value;
      const Party = document.querySelector("#party").value;
      const transaction = await contract.addCandidate(City, Name, Party);
      await transaction.wait();
      console.log("Candidate Added");
    } catch (error) {
      console.log(error);
    }
  };

  const ballotDetails = async (e) => {
    try {
      e.preventDefault();
      const City = ballotCity;
      const details = await contract.getBallotDetails(City);
      console.log(details);
      setBDetails({
        city: details[0],
        admin: details[1],
        isOpen: details[2].toString(),
        candidateCount: details[3].toString(),
      });
    } catch (error) {
      setBDetails({
        city: "Invalid City",
        admin: "Wrong Address",
        isOpen: false,
        candidateCount: 0,
      });
    }
  };

  const getCandidateDetails = async (e) => {
    try {
      e.preventDefault();
      const I1 = candidateCity;
      const I2 = parseInt(candidateIndex);
      const details = await contract.getCandidateDetails(I1, I2);
      console.log(details);
      setCDetails({
        name: details[0],
        party: details[1],
        voteCount: details[2].toString(),
      });
    } catch (error) {
      setCDetails({
        name: "Invalid Index",
        party: "",
        voteCount: "",
      });
    }
  };

  const getResult = async () => {
    const City = city;
    const Details = await contract.getResult(City);

    setResult({
      winnerName: Details[0],
      winnerParty: Details[1],
    });

    console.log(Details);
  };

  const closeballot = async () => {
    const Details = await contract.closeBallot(close);
    await Details.wait();
    setClose(Details);
    console.log(Details);
    console.log("ballot closed");
  };

  return (
    <div className="admin">
      <h1 className="text-center">Admin Panel</h1>
      <br />
      <div>
        <button className="ob" onClick={createBallot}>
          Create Ballot
        </button>
        <input type="text" placeholder="City" id="city" />
      </div>
      <div>
        <button
          type="button"
          className="ob"
          data-bs-toggle="modal"
          data-bs-target="#BallotDetailModal"
          onClick={ballotDetails}
        >
          Ballot Details
        </button>
        <input
          type="text"
          placeholder="enter city to check the ballot"
          value={ballotCity}
          onChange={(event) => {
            setBallotCity(event.target.value);
          }}
        />
      </div>
      <hr />
      <div>
        <h2 className="text-center">Add Candidate</h2>
        <button className="ob" onClick={addCandidate}>
          Add Candidate
        </button>
        <input type="text" placeholder="city" id="city" />
        <input type="text" placeholder="Candidate Name" id="name" />
        <input type="text" placeholder="Candidate Party" id="party" />
        <hr />
      </div>

      <div
        className="modal fade "
        id="BallotDetailModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Ballot Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table vertical-lines">
                <tbody>
                  <tr>
                    <td>City</td>
                    <td>{bDetails.city}</td>
                  </tr>
                  <tr>
                    <td>Admin</td>
                    <td>{bDetails.admin}</td>
                  </tr>
                  <tr>
                    <td>Is Open</td>
                    <td>{bDetails.isOpen}</td>
                  </tr>
                  <tr>
                    <td>Candidates</td>
                    <td>{bDetails.candidateCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="ob"
          data-bs-toggle="modal"
          data-bs-target="#CandidateDetailModal"
          onClick={getCandidateDetails}
        >
          Candidate Details
        </button>
        <input
          type="text"
          placeholder="enter candidate city"
          value={candidateCity}
          onChange={(e) => setCandidateCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="enter candiadte index"
          value={candidateIndex}
          onChange={(e) => setCandidateIndex(e.target.value)}
        />
        <div
          className="modal fade"
          id="CandidateDetailModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Candiadte Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <table className="table vertical-lines">
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>{cDetails.name}</td>
                    </tr>
                    <tr>
                      <td>Party</td>
                      <td>{cDetails.party}</td>
                    </tr>
                    <tr>
                      <td>Votes</td>
                      <td>{cDetails.voteCount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <button className="ob" onClick={closeballot}>
          Close Ballot
        </button>
        <input
          type="text"
          placeholder="city"
          value={close}
          onChange={(e) => setClose(e.target.value)}
        />
      </div>
      <hr />
      <div>
        <button
          type="button"
          className="ob"
          data-bs-toggle="modal"
          data-bs-target="#ResultModal"
          onClick={getResult}
        >
          Result
        </button>
        <input
          type="text"
          placeholder="city result"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div
        className="modal fade"
        id="ResultModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Result
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table vertical-lines">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{result.winnerName}</td>
                  </tr>
                  <tr>
                    <td>Party</td>
                    <td>{result.winnerParty}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import Home from "./component/Home";
import EmailVerification from "./component/EmailVerification";
import ForgotPassword from "./component/ForgotPassword";
import Lotp from "./component/Lotp";
import AdminL from "./component/AdminL";
import AdminPanel from "./component/AdminPanel";
import abi from "./contracts/EVoting.json";
import VotingPanel from "./component/VotingPanel";
import Test from "./component/Test";
import { ethers } from "ethers";
import { CredentialsProvider } from "./Context/CredentialContext";
import Alert from "./component/Alert"
function App() {
  const [alert,setAlert] = useState(null)

  const Showalert = (message,type)=>{
    setAlert({
      msg: message,
      type: type,
    })
    setTimeout(()=>{
     setAlert(null); 
    },1500)
  }
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  const [account, setAccount] = useState("none");
  console.log(account);

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0xDc04682ba8adcfFFbE935854f1476b96fBC6dfA3";
      const contractAbi = abi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          window.ethereum.on("chainchanged", () => {
            window.location.reload();
          });
          window.ethereum.on("Accountchanged", () => {
            window.location.reload();
          });

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  console.log(state);

  return (
    <div>
      <Router>
        <Navbar />
        <Alert alert={alert}/>
        <CredentialsProvider>
          <Routes>
            <Route path="/login" element={<Login Showalert={Showalert}/>} />
            <Route path="/" element={<Home Showalert={Showalert}/>} />
            <Route path="/signup" element={<SignUp Showalert={Showalert}/>} />
            <Route path="/verify" element={<EmailVerification Showalert={Showalert}/>} />
            <Route path="/reset-password" element={<ForgotPassword Showalert={Showalert}/>} />
            <Route path="/verify-otp" element={<Lotp Showalert={Showalert}/>} />
            <Route path="/admin" element={<AdminL Showalert={Showalert}/>} />
            <Route
              path="/adminpanel"
              element={<AdminPanel state={state} Showalert={Showalert}/*Test*//>} 
            />
            <Route path="/voting" element={<VotingPanel state={state} Showalert={Showalert}/>}  />
            <Route path="/getVoterId" element={<Test Showalert={Showalert}/>}  />
          </Routes>
        </CredentialsProvider>
      </Router>
    </div>
  );
}

export default App;

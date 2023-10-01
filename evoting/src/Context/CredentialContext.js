import React, { createContext, useContext, useState } from "react";

// Create a context
const CredentialContext = createContext();

// Create a provider component
export const CredentialsProvider = ({ children }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    voterid: "",
    adharno: "",
  });

  return (
    <CredentialContext.Provider value={{ credentials, setCredentials }}>
      {children}
    </CredentialContext.Provider>
  );
};

// Custom hook to access credentials
export const useCredentials = () => {
  return useContext(CredentialContext);
};

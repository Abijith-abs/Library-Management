import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config"; // Make sure this is correct

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvide = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user
  const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth,email, password);
  };

  const logoutUser = () => {
    return signOut(auth);
  };

  //manage user
  useEffect (() =>{
    const unsubscribe = onAuthStateChanged(auth,(user) => {
        setCurrentUser(user);
        setLoading(false);
        if(user){
            const {email,displayName,photoURL } = user;
            const userData = {
                email, username :displayName , photo:photoURL
            }
        }
        
    })
    return () => unsubscribe();
  },[])

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    logoutUser

}

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

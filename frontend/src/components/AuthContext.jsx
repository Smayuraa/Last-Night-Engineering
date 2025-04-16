// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(data);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

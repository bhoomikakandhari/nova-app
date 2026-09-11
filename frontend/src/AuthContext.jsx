import { createContext,useContext,useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({children}){
    const[user, setUser] = useState(()=>{
        const saved = localStorage.getItem("nova_user");
        return saved? JSON.parse(saved): null;
    });

    function login(token, userData){
        localStorage.setItem("nova_token",token);
        localStorage.setItem("nova_user",JSON.stringify(userData));
        setUser(userData);
    }

    function logout(){
        localStorage.removeItem("nova_token");
        localStorage.removeItem("nova_user");
        setUser(null);
    }

  return (
    <AuthContext.Provider value={{user,login,logout}}>
        {children}
    </AuthContext.Provider>
  );

}

export function useAuth(){
    return useContext(AuthContext);
}
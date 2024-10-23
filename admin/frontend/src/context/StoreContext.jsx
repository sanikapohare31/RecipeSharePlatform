import { createContext, useState,useEffect } from "react";
export const StoreContext = createContext(null)

export const StoreContextProvider = (props) =>{
    const url ="http://localhost:4000"
    const [token,setToken] =useState("");
    

    useEffect(()=>{
        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
            
        }
    },[])
    const contextValue ={
        url,
        token,
        setToken

    }
    return(
        <StoreContext.Provider  value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

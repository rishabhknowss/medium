import { ChangeEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SignupInput } from "@100xdevs/medium-common"
import axios from "axios"
import { BACKEND_URL } from "../config"
export const Auth = ({type}: {type : "signin" | "signup"})=>{
    const [postInputs,setPostInputs]= useState<SignupInput>({
        name:"",
        username:"",
        password:""
    })

    const navigate = useNavigate();


    async function sendRequest(){
    try{
        const response = await axios.post(`${BACKEND_URL}api/v1/user/${type=="signin"?"signin" : "signup"}`,postInputs);
        const jwt = response.data;
        localStorage.setItem("token",jwt);
        navigate("/blog")
    }
    
    catch(e){
            alert("failed!!!!!")
    }
}
    
    return <>
       <div className="h-screen flex justify-center flex-col">
       
            <div className="flex justify-center"><div>
            <div className="text-3xl font-extrabold">Create an account</div>
            <div className="text-slate-400 pt-1">{type=="signup" ?"Already have an account?" : `Don't have an account?`}<Link className="underline" to={type== "signup" ? "/signin" : "/signup"}>{type=="signup" ? "signIn" : "signUp"}</Link></div>
            {type=="signup" ?<div className="mt-3"><LabelledInputs label="Name" placeholder="Rishabh Rai" onChange={(e)=>{setPostInputs({...postInputs , name : e.target.value})}}></LabelledInputs></div>
             :null}
            <div className=""><LabelledInputs label="Username" placeholder="rishabh@rai.com" onChange={(e)=>{setPostInputs({...postInputs , username : e.target.value})}}></LabelledInputs></div>
            <div className=""><LabelledInputs label="Password" placeholder="password" type="password" onChange={(e)=>{setPostInputs({...postInputs , password : e.target.value})}}></LabelledInputs></div>
            <button type="button" onClick={sendRequest}className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full mt-3 ">{type == "signup"? "Sign Up" : "Sign In"}</button></div>
       
       </div></div>
     
    </>
}

interface LabelledInputstypes{
    label : string,
    placeholder : string,
    onChange : (e : ChangeEvent<HTMLInputElement>) => void,
    type?: string
}

function LabelledInputs({label , placeholder , onChange , type} : LabelledInputstypes){


    return <>

    <div className="font-bold mt-2">{label}</div>
    <input type={type || "text"}  placeholder={placeholder} onChange={onChange} className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "></input>
    
    </>

}
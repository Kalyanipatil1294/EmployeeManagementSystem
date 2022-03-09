import { useState } from "react";
import "./login.css";
import imag from "./loginIcon.png";
import { Navigate } from "react-router-dom";

const Login = () => {
    const [isLoading, setLoader] = useState(false);
    const [userType, setUser] = useState("");
    const [user, setUDetails] = useState({});
    const [invalid, setInvalid] = useState(false);
    const onLogin =() => {
        const name = document.getElementById("uname").value;
        const pwd = document.getElementById("psw").value;
        let content;

        (async () => {
            const rawResponse = await fetch('http://localhost:8090/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: name.toString(), password: pwd.toString()})
            });
            content = await rawResponse.json();
            if(content) {
                setUser(content.type)
                setUDetails(content)
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("currentEmp", JSON.stringify(content));
                } else {
                    console.log("Sorry! No Web Storage support..");
                }
                if(!content.type) {
                    setInvalid(true)
                }
            }
        })();
        setLoader(false)
    }

    if(userType === "admin") {
        return  <Navigate to='/admin' />
    } else if(userType === "emp") {
        return  <Navigate to='/empView' />
    }

    return (
        <div>
            <div className="login-header">Employee Management System</div>
        <div className="login">
            <div className="img-container">
                <img src={imag} alt="Avatar" className="avatar" />
            </div>

            <div className="container-log">
                {invalid ? <div className="error">Incorrect UserName or Password!!!</div> : null}
                <label htmlFor="uname"><b>Username</b></label>
                <input id="uname" type="text" placeholder="Enter Username" name="uname" required />
                <label htmlFor="psw"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" id="psw" required />
                <button className="login-button" type="submit" onClick={onLogin}>Login</button>
            </div>
        </div>
        </div>
    )
}
export default Login;
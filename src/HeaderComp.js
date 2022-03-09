import "./header.css";
import {Link, Navigate, Redirect} from "react-router-dom";
import {useEffect, useState} from "react";
import {AiFillHome, AiOutlineUnorderedList} from "react-icons/ai";

const HeaderComp = () => {
    const [emp, setUser] = useState({});
    const [hasSet, setHasSet] = useState(false);
    const onLogOut = () => {
        localStorage.removeItem("currentEmp");
    }

    useEffect(() => {
        if(!hasSet) {
            if (typeof (Storage) !== "undefined") {
                const employee = JSON.parse(localStorage.getItem("currentEmp"));
                setUser(employee)
                setHasSet(true)
                if (!employee || !employee.id) {
                    return <Navigate to='/admin'/>
                }
            } else {
                console.log("Sorry! No Web Storage support..");
            }
        }
    }, [emp]);

    return <>
    {
        emp ?
            <div className="header-container">
                <div>
                    <Link to="/empView"><AiFillHome className="header-icon"/></Link>
                    {emp.type === "admin" ? <Link to="/admin"><AiOutlineUnorderedList className="header-icon"/></Link> : null}
                </div>
                <span>Welcome to Employee Management System {emp.name} !!!</span>
                <Link to="/"><span className="spanhere" onClick={onLogOut}>Logout</span></Link>
            </div>
            :
            <Navigate to={{ pathname: '/' }} />
    }
    </>
}

export default HeaderComp;
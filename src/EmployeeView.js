import {Link, Navigate} from "react-router-dom";
import HeaderComp from "./HeaderComp";
import "./empview.css"
import {useEffect, useState} from "react";
import {FaUserCircle, FaCalendar, FaMoneyBill} from "react-icons/fa";

const EmployeeView = () => {
    const [isEdit, setEdit] = useState(false);
    const [emp, setEmp] = useState({});
    const [hasSet, setHasSet] = useState(false);

    const saveChanges = () => {
        const name = document.getElementById("name").value;
        const id = document.getElementById("empId").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        emp.name = name;
        emp.id = id;
        emp.email = email;
        emp.address = address;
        (async () => {
            const rawResponse = await fetch('http://localhost:8090/updateEmployee', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emp)
            });
            const content = await rawResponse.json();
            setEdit(false);
            if(content) {
                setEmp(content)
                if (typeof(Storage) !== "undefined") {
                    localStorage.removeItem("currentEmp")
                    localStorage.setItem("currentEmp", JSON.stringify(content));
                } else {
                    console.log("Sorry! No Web Storage support..");
                }
            }
        })();

    }

    useEffect(() => {
        if(!hasSet) {
            if (typeof (Storage) !== "undefined") {
                const employee = JSON.parse(localStorage.getItem("currentEmp"));
                console.log(employee);
                setEmp(employee)
                setHasSet(true)

            } else {
                console.log("Sorry! No Web Storage support..");
            }
        }
    }, [emp])

    console.log(emp)

    return <div>
        <HeaderComp />
        <div className="empView">
            <div className="emp-Details">
                <div className="emp-head">
                    <div className="emp-image" />
                    <div className="emp-header">Employee Details</div>
                </div>
                <div className="field-details-section">
                    <FaUserCircle className="icon"/><span className="field">Employee ID: </span>
                    {isEdit ? <input defaultValue={emp.id} id="empId"/> : <span className="details">{emp.id}</span>}

                </div>
                <div className="field-details-section">
                    <FaUserCircle className="icon"/><span className="field">Full Name: </span>
                    {isEdit ? <input defaultValue={emp.name} id="name"/> : <span className="details">{emp.name}</span>}

                </div>
                <div className="field-details-section">
                    <FaMoneyBill className="icon"/><span className="field">Email: </span>
                    {isEdit ? <input defaultValue={emp.email} id="email"/> : <span className="details">{emp.email}</span>}
                </div>
                <div className="field-details-section">
                    <FaMoneyBill className="icon"/><span className="field">Salary: </span>
                    <span className="details">{emp.salaryPerHour}$</span>
                </div>
                <div className="field-details-section">
                    <FaMoneyBill className="icon"/><span className="field">Address: </span>
                    {isEdit ? <input defaultValue={emp.address} id="address"/> : <span className="details">{emp.address}</span>}
                </div>
                {isEdit ? <button onClick={saveChanges}>Save Changes</button> : null}
                <div className="nav-link">
                    <Link to="/addhrs" className="link">Add Hours</Link>
                    <Link to="/payslip" className="link">Payslips</Link>
                    <button onClick={() => {
                        setEdit(!isEdit)
                    }} className="editButton">Edit Details
                    </button>
                </div>
            </div>
        </div>

    </div>
}

export default EmployeeView;
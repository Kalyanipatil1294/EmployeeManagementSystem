import imag from "./loginIcon.png";
import "./employee.css"
import HeaderComp from "./HeaderComp";
import {Link, NavLink} from "react-router-dom";

const AddEmployee = () =>{
    const update =() => {
        const userId = document.getElementById("userId").value;
        const pwd = document.getElementById("pwd").value;
        const name = document.getElementById("uname").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const salary = document.getElementById("salary").value;

        (async () => {
            const rawResponse = await fetch('http://localhost:8090/addEmployee', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: userId, name: name, password: pwd, email: email, address: address, salaryPerHour: salary, type: "emp"})
            });
            const content = await rawResponse.json();
            alert("Employee Added Successfully")
        })();
    }

    return   (
        <>
            <HeaderComp />
        <div className="container">
            <div className="img-container">
                <img src={imag} alt="Avatar" className="avatar" />
            </div>
            <div>
                <label htmlFor="userId"><b>Employee User ID</b></label>
                <input id="userId" type="text" placeholder="Enter ID" name="uname" required />

                <label htmlFor="uname"><b>Employee Name</b></label>
                <input id="uname" type="text" placeholder="Enter Username" name="uname" required />

                <label htmlFor="uname"><b>Set Default Password</b></label>
                <input id="pwd" type="text" placeholder="Set Default password" name="uname" required />

                <label htmlFor="email"><b>Email</b></label>
                <input type="text" placeholder="Enter email" id="email" required />

                <label htmlFor="address"><b>Address</b></label>
                <input type="text" placeholder="Enter address" id="address" required />

                <label htmlFor="salary"><b>Salary per hour</b></label>
                <input type="text" placeholder="Enter salary" id="salary" required />

                <div className="buttonContainer"><button type="submit" onClick={update}>Add Employee</button></div>
            </div>
        </div>
            </>
    )
}

export default AddEmployee;
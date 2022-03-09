import "./employeetable.css";
import { Link } from "react-router-dom";
import { AiFillDelete, AiFillEdit} from "react-icons/ai"
import { useState } from "react";

const EmployeeTable = ({employees, onDelete, onUpdateDetails, onApprove: onApproveProps}) => {
    const [editRow, setEditRow] = useState(null);

    const onUpdate = (empId) => {
        const hrs = document.getElementById("newsalary").value;
        onUpdateDetails(empId, hrs)
        setEditRow(null)
    }
    const editClick = (empId) => {
        setEditRow(empId)
    }

    const onApprove = (emp) => {
        onApproveProps(emp)
    }
    const deleteClick = (empId) => {
        // eslint-disable-next-line no-restricted-globals
        const result = confirm("Please confirm that you want to remove this employee!!");
        if(result) {
            onDelete(empId)
        }
    }
    const displayEmployee  = () => {
        return employees.map((emp, index) => {
            return  ( <tr key={index}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.address}</td>
                <td>
                    {emp.hrs ?  <><label>{emp.hrs}</label> <button onClick={() => {onApprove(emp)}}>Approve</button></>: <label>Up-to-date!!!</label>}
                </td>
                <td>
                    {editRow === emp.id ?  <input id="newsalary" defaultValue={emp.salaryPerHour}/> : <>{emp.salaryPerHour}</>}
                </td>

                <td className="action-item-container">
                    {
                        editRow !== emp.id ?
                            <>
                                <span className="action-item" title="Remove Employee" onClick={() => {deleteClick(emp.id)}}><AiFillDelete className="icon-action"/> </span>
                                <span className="action-item"  title="Edit Salary" onClick={() => {editClick(emp.id)}} > <AiFillEdit className="icon-action"/></span>
                            </>
                            :
                            <button onClick={() => onUpdate(emp.id)}>Update</button>
                    }
                </td>
            </tr>)
        })
    }

    return <div>
         <div className="button-container">
             <button className="icon-button"><Link to="/payslip">Generate Payslip</Link></button>
             <button className="icon-button"> <Link to="/addemployee">Add Employee</Link></button>
             <button className={"icon-button"}> <Link to="/empview">View Your Details</Link></button>
         </div>
        <table>
            <tr>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Approval</th>
                <th>Salary per hour</th>
                <th>Actions</th>
            </tr>
            {displayEmployee()}
        </table>

    </div>
}
export default EmployeeTable;
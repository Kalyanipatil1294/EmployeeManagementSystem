import React from "react";
import "./salaryslip.css";
import {createPdfFromHtml} from "./logic";

export const PrintPage = ({month, year, salary}) => {
    let printContent;
    const handleClick = () => {
        createPdfFromHtml(printContent);
    };
    return (<>
        <button onClick={handleClick}>Download The Payslip</button>
        <div id="print" className="A4">
            <Sheet month={month} year={year} salary={salary}/>
            <div style={{position: "fixed", top: "200vh"}}>
                <div ref={el => printContent = el}/>
            </div>
        </div>
    </>);
}

const Sheet = ({month, year, salary}) => {
    const totalSalary = salary?.totalSalary ?? 0;

    let employee;
    if (typeof (Storage) !== "undefined") {
        employee = JSON.parse(localStorage.getItem("currentEmp"));
    } else {
        console.log("Sorry! No Web Storage support..");
    }
    return (<div className="sheet padding-10mm">
        <h4>Employee Management System</h4>
        <div className="pay">
            <div>
                <div className="row">Employee UserID: {employee.id}</div>
                <div className="row">Employee Name: {employee.name}</div>
                <div className="row">Employee Address: {employee.address}</div>
                <div className="row">Employee Address: {employee.email}</div>
                <div className="row">Month: {month}, {year}</div>
            </div>
            <div>
                <div className="row">Bank Name: XXXX</div>
                <div className="row">Bank Code: XXXX</div>
                <div className="row">Payslip Code: {employee.id}-{month}{year}</div>
                <div className="row">SSN: XXXXXXXX90</div>
                <div className="row">Bank A/C no.: XXXXXX</div>
            </div>
        </div>
        <div className={"salary-main "}>
            <div className="salary-row head"><span>Payments</span><span>Payments</span></div>
            <div className="salary-breakup">
                <div className="salary-row"><span>Salary per hour</span><span>{employee.salaryPerHour}</span></div>
                <div className="salary-row"><span>Basic Salary</span><span>{totalSalary}</span></div>
                <div className="salary-row"><span>Fixed Dearness Allowance</span><span>00</span></div>
                <div className="salary-row"><span>Fixed Dearness Allowance</span><span>00</span></div>
                <div className="salary-row"><span>Variable Dearness Allowance</span><span>00</span></div>
                <div className="salary-row"><span>House Rent Allowance</span><span>00</span></div>
                <div className="salary-row"><span>Graduation Allowance</span><span>00</span></div>
                <div className="salary-row"><span>Conveyance Allowance</span><span>00</span></div>
            </div>
        </div>
        <div className="salary-footer"><span>NetPay: {totalSalary}</span></div>
    </div>);
};

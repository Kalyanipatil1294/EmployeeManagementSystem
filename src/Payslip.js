import { PrintPage } from "./print";
import HeaderComp from "./HeaderComp";
import {useEffect, useState} from "react";
import "./payslip.css"


const Payslip =() => {
    const [month, setMonth] = useState("jan")
    const [year, setYear] = useState("2022")
    const [selectedEmp , setSelectedEmp] = useState(null)
    const [salary, setSalary] = useState(null)
    const [emps , setEmps] = useState([]);
    const employee = JSON.parse(localStorage.getItem("currentEmp"));
    let isAdmin = false;
    if(employee && employee.type === "admin") {
        isAdmin = true;
    }
    const onMonthSelect = (e) => {
        setMonth(e.target.value)
        refreshSalary();
    }
    const onYearSelect = (e) => {
        setYear(e.target.value)
    }

    const onEmpChange = (e) => {
        let val = e.target.value;
        val = val.split("-")[1];
        refreshSalary();
        setSelectedEmp(val);
        const result = fetch(
            `http://localhost:8090/generatePaySlip`
        );

        result.then(res => {
            return res.json();
        }).then(res => {
            console.log(res)
            // setEmps(res.result)
        }).catch(e => console.log("error", e))
            .finally(e => console.log("finally", e))
    }

    const refreshSalary = () => {
        (async () => {
            const { id } = employee;
            const rawResponse = await fetch('http://localhost:8090/generatePaySlip', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id, month: month})
            });
            const content = await rawResponse.json();
            setSalary(content)
        })();
    }
    useEffect(() => {
        refreshSalary();

        const result = fetch(
            `http://localhost:8090/getAllEmployees`
        );

        result.then(res => {
            return res.json();
        }).then(res => {
            setEmps(res.result)
        }).catch(e => console.log("error", e))
            .finally(e => console.log("finally", e))

        const salaryEmp = fetch(
            `http://localhost:8090/getAllEmployees`
        );

        salaryEmp.then(res => {
            return res.json();
        }).then(res => {
            setEmps(res.result)
        }).catch(e => console.log("error", e))
            .finally(e => console.log("finally", e))


    }, [])


    const getEmployeeDom = () => {
        return emps.map((e) => {
            return <option>{e.name} - {e.id}</option>
        });
    }

    return <div>
        <HeaderComp />
        <div className="payslip-container">
            <div className="payslip-detail">
                Select the Month and year for generating Payslip:
                <select name="month" id="month" onChange={(e) => onMonthSelect(e)}>
                    <option value="Jan">Jan</option>
                    <option value="Feb">Feb</option>
                    <option value="March">March</option>
                </select>
                <select name="year" id="year" onChange={(e) => onYearSelect(e)}>
                    <option value="2022">2022</option>
                </select>
                {isAdmin ?
                    <div className="emp-management">
                        Select the employe for which you want to generate Payslip:
                        <select name="year" id="year" onChange={(e) => onEmpChange(e)}>
                            {getEmployeeDom()}
                        </select>
                    </div>
                    : null
                }
            </div>
            <PrintPage month={month} year={year} salary={salary}/>
        </div>
    </div>
}

export default Payslip
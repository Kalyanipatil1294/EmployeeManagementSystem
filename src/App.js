import EmployeeTable from "./EmployeeTable";
import HeaderComp from "./HeaderComp";
import { useEffect, useState } from "react";
import './App.css';

function App() {

    const [emps, setEmps] = useState([])
    const [loading, setLoading] = useState(false);
    const [setHrs, setHours] = useState(false);

    const onDelete = (empId) => {
        (async () => {
            const rawResponse = await fetch('http://localhost:8090/removeEmployee', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: empId})
            });
            const content = await rawResponse.json();
            setLoading(false)
            setEmps([])
        })();
    }

    const setEmployeeData = (empArray, hrs) => {
        const result =[];

        for(let e of empArray) {
            let set = false;
            for(let h of hrs) {
                if(e.id === h.id) {
                    set = true
                    e.hrs = h.totalHours;
                    e.month = h.month;
                    result.push(e)
                }
            }
            if(!set) {
                e.hrs = 0;
                e.month = 0;
                result.push(e)
            }
        }
        setEmps(result)
    }

    const onApprove = (emp) => {
        (async () => {
            const rawResponse = await fetch('http://localhost:8090/approveHours', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: emp.id})
            });
            const content = await rawResponse.json();
            setLoading(false)
            setEmps([])
        })();
    }

    const onUpdateDetails = (empId, hrs) => {
        let empToBeUpdated = {};
        for(let e of emps) {
            if(e.id === empId) {
                empToBeUpdated = e;
                break;
            }
        }

        empToBeUpdated.salaryPerHour = Number(hrs);

        (async () => {
            const rawResponse = await fetch('http://localhost:8090/updateEmployee', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empToBeUpdated)
            });
            const content = await rawResponse.json();
            setLoading(false)
            setEmps([])
        })();
    }

    useEffect(() => {
        let resultArr = []
        if(!loading) {
            const result = fetch(
                `http://localhost:8090/getAllEmployees`
            );

            result.then(res => {
                return res.json();
            }).then(res => {
                resultArr = res.result;
                setLoading(true)
                const result2 = fetch(
                    `http://localhost:8090/getAllEmployeeHours`
                );
                result2.then(res => {
                    return res.json();
                }).then(res => {
                    setEmployeeData(resultArr, res);
                    console.log(res)
                    setLoading(true)
                }).catch(e => console.log("error", e))
                    .finally(e => console.log("finally2", e))
            }).catch(e => console.log("error", e))
                .finally(e => console.log("finally", e))
        }
    }, [emps]);

    return (
      <div>
          <HeaderComp />
        <div className="App">
            <EmployeeTable employees={emps} onDelete={onDelete} onUpdateDetails={onUpdateDetails} onApprove={onApprove}/>
        </div>
      </div>
  );
}

export default App;

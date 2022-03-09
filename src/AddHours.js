import HeaderComp from "./HeaderComp";
import "./addhrs.css";
import { useEffect, useState } from "react";

const AddHours = () => {
    const [editHourId,setEditDate] = useState(null);
    const [workingDays, setWorkingDays] = useState([]);
    const [isLoaded, setLoading] = useState(false)
    const employee = JSON.parse(localStorage.getItem("currentEmp"));


    function isInTheFuture(date) {
        const today = new Date();
        today.setHours(23, 59, 59, 998);
        return date > today;
    }

    function formatDate(date, isPrev) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate()+ isPrev ? 1: 0),
            year = d.getFullYear();

        let dayFinal = isPrev ? (d.getDate()-1) + "" : day;

        if (month.length < 2)
            month = '0' + month;
        if (dayFinal.length < 2)
            dayFinal = '0' + dayFinal;

        return [year, month, dayFinal].join('-');
    }

    const onSubmit = () => {
        const obj = {};
        const empHours =[];

        for(let wd of workingDays) {
            if(wd.hrs) {
                empHours.push({date: formatDate(wd.date), hours: wd.hrs})
            }
        }
        obj.empHours = empHours;
        let { id } = employee
        obj.id = id;

        (async () => {
            const rawResponse = await fetch('http://localhost:8090/updateHours', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const content = await rawResponse.json();
        })();
    }

    const doneAdding = (dayId) => {
        const hrs = Number(document.getElementById("workingHours").value);
        if(hrs > 12) {
            alert("You can not add more than 12 hrs")
        } else {
            const updated = workingDays.map((wd) => {
                if (wd.id === dayId) {
                    wd.hrs = hrs
                }
                return wd;
            })
            setWorkingDays([...updated])
            setEditDate(null)
        }
    };

    const getLastTenWD = (emp) => {
        const hrs = emp.empHours
        let curr = new Date; // get current date
        let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        let result = []
        let id= 1;
        for(let i = -6; i< 6; i++) {
            if(i !== -1 && i!== 0) {
               const currDate = new Date();
                currDate.setDate(first + i)
                currDate.setHours(0);
                currDate.setMinutes(0);
                currDate.setSeconds(0);
                currDate.setMilliseconds(0);
                const compDate = formatDate(currDate, true);
                let isAdded = false;
               for(let h of hrs) {
                   // const newDate = new Date(h);
                   if(!isAdded && compDate ===  h.date) {
                       isAdded = true
                       result.push(
                           {
                               id: id,
                               date: currDate.toUTCString(),
                               hrs: h.hours,
                               disabled: isInTheFuture(currDate) || h.approved === "YES"
                           })
                       id++;
                   }
               }

               if(!isAdded) {
                   result.push(
                       {
                           id: id,
                           date: currDate.toUTCString(),
                           hrs: 0,
                           disabled: isInTheFuture(currDate)
                       })
                   id++;
               }
            }
        }
        return result
    }

    useEffect(() => {
        if(!isLoaded) {
            (async () => {
                const rawResponse = await fetch('http://localhost:8090/getEmployeeEnteredHours', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: employee.id})
                });
                const content = await rawResponse.json();
                setWorkingDays(getLastTenWD(content));
                console.log(content)
                setLoading(true)
            })();
        }
    }, []);

    const displayLastTenWorkingDays  = () => {
        return workingDays.map((wd, index) => {
            const className = wd.disabled ? "disabled" : "";
            return  ( <tr key={index} className={className}>
                <td>{wd.date}</td>
                <td>
                    {editHourId === wd.id ?
                        <>
                            <input value={wd.hr} id="workingHours"/>
                            <label>Total Hours</label>
                        </> :
                        <>{wd.hrs}</>
                    }
                </td>
                <td>
                    {editHourId === wd.id ?
                        <button onClick={() => {doneAdding(wd.id)}}>Done</button> :
                        <button disabled={wd.disabled} onClick={() => {setEditDate(wd.id)}}>Edit Hours</button>
                    }
                </td>
            </tr>)
        })
    }

    return <div>
        <HeaderComp />
        <div className="table-container">
        <table>
            <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Edit Hours</th>
            </tr>
            {displayLastTenWorkingDays()}
        </table>
        <button onClick={() =>onSubmit()}> Submit  Hours</button>
        </div>
    </div>
}

export default AddHours;
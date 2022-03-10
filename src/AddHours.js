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

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + (d.getDate()),
            year = d.getFullYear();


        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
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
            alert("Hours Added Successfully")
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
                               disabled: h.approved === "YES",
                               isFuture: isInTheFuture(currDate),
                               orgDate: currDate
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
                           disabled: false,
                           isFuture: isInTheFuture(currDate),
                           orgDate: currDate
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
            const text = wd.disabled ? "Approved" : "You cannot add future hours !!";
            const className = wd.disabled ? "disabled" : "";
            const but_className = wd.disabled  ||  wd.isFuture? "but-disabled" : "";
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
                <td className="info"> {wd.disabled || wd.isFuture ? <>{text}</>: null}</td>
                <td>
                    {editHourId === wd.id ?
                        <button onClick={() => {doneAdding(wd.id)}}>Done</button> :
                        <button disabled={wd.disabled || wd.isFuture} onClick={() => {setEditDate(wd.id)}} className={but_className}>Edit Hours</button>
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
                <th>Status</th>
                <th>Edit Hours</th>
            </tr>
            {displayLastTenWorkingDays()}
        </table>
        <button onClick={() =>onSubmit()}> Submit  Hours</button>
        </div>
    </div>
}

export default AddHours;
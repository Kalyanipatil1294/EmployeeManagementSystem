import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import AddEmployee from "./AddEmployee";
import AddHours from "./AddHours";
import EmployeeView from "./EmployeeView";
import Payslip from "./Payslip";


ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login />}/>
              <Route index path="/admin" element={<App />} />
              <Route index path="/addemployee" element={<AddEmployee />} />
              <Route index path="/addhrs" element={<AddHours />} />
              <Route index path="/empview" element={<EmployeeView />} />
              <Route index path="/payslip" element={<Payslip />} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

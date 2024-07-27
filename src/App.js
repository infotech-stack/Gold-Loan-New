import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Dashboard from "./Dashboard/Dashboard";
import Login from "./Login/Login";
import Master from "./Master/Master";
import AddedAdm from "./Added_admin/Added_adm";
import Customer from "./Customer/Customer";
import Repledge from "./Repledge/Repledge";
import Accounts from "./Expenses/daytoday";
import Reminders from "./Reminders/Reminders";
import Books from "./Books/Books";
import Tools from "./Tools/Tools";
import { AuthProvider } from "./AuthContext";
import AddAdminPage from "./Newrootadmin/Newrootadmin";
import GoldLoanSchema from "./Master/Goldloanschema";
import GoldLoanAmount from "./Master/GoldloanAmount";
import GoldLoanCategory from "./Master/Goldcategory";
import User from "./User/User";
import Branch from "./Branch/Branch";
import Voucher from "./Voucher/Voucher";
import Employee from "./Employee/Employee";
import Report from "./Report/Report";
import LoanRetrieved from "./Loan Retrieved/LoanRetrived";
import Salary from "./Expenses/Salary";
function App() {
  const [permissions, setPermissions] = useState([]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={<Login setPermissions={setPermissions} />}
          />
          <Route element={<Layout permissions={permissions} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/master" element={<Master />} />
            <Route path="/master/loan" element={<GoldLoanSchema />} />
            <Route path="/master/amount" element={<GoldLoanAmount />} />
            <Route path="/master/category" element={<GoldLoanCategory />} />
            <Route path="/added_admin" element={<AddedAdm />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/root_man" element={< User/>} />
            <Route path="/branch" element={< Branch/>} />
            <Route path="/voucher" element={< Voucher/>} />
            <Route path="/admin_man" element={< Employee/>} />
            <Route path="/report" element={<Report/>}/>
            <Route path="/repledge" element={<Repledge />} />
            <Route path="/loan_retrieved" element={<LoanRetrieved/>}/>
            <Route path="/expenses" element={<Accounts />} />
            <Route path="/expenses/salary-payment"element={<Salary />}/>
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/books" element={<Books />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/new_root" element={<AddAdminPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

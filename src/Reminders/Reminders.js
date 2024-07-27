import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Paper,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Reminders = () => {
  const [dayToDayExpenses, setDayToDayExpenses] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [apraisalentries, setApraisalentries] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vouchersRes, expensesRes, salariesRes, ledgerRes, appraisalRes] = await Promise.all([
          axios.get("http://localhost:5000/api/vouchers/all"),
          axios.get("http://localhost:5000/api/expenses"),
          axios.get("http://localhost:5000/api/salary"),
          axios.get("http://localhost:5000/api/ledger/all"),
          axios.get("http://localhost:5000/api/loanEntry/all"),
        ]);

        const formatData = (data) => data.map((item) => ({
          ...item,
          date: formatDate(item.date),
          paymentDate: formatDate(item.paymentDate),
        }));

        setVouchers(formatData(vouchersRes.data));
        setDayToDayExpenses(formatData(expensesRes.data));
        setSalaries(formatData(salariesRes.data));
        setLedgerEntries(formatData(ledgerRes.data));
        setApraisalentries(formatData(appraisalRes.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const filterDataByDateRange = (data) => {
    if (!startDate || !endDate) return data;
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return data.filter((item) => {
      const dateField = new Date(item.date || item.paymentDate);
      return dateField >= start && dateField <= end;
    });
  };

  const aggregateDataByDate = (data, amountFields) => {
    return data.reduce((acc, item) => {
      const date = item.date || item.paymentDate;
      if (!acc[date]) {
        acc[date] = {
          totalAmount: 0,
          date: date,
        };
      }

      amountFields.forEach(field => {
        acc[date].totalAmount += parseFloat(item[field] || 0);
      });

      return acc;
    }, {});
  };

  const aggregatedExpenses = aggregateDataByDate(dayToDayExpenses, ['totalRupees']);
  const aggregatedSalaries = aggregateDataByDate(salaries, ['salaryAmount']);
  const aggregatedVouchers = aggregateDataByDate(vouchers, ['amount']);
  const aggregatedLedger = aggregateDataByDate(ledgerEntries, ['loanAmount']);
  const aggregatedAppraisals = aggregateDataByDate(apraisalentries, ['interestamount', 'interestPrinciple']);

  const allDates = [
    ...new Set([
      ...Object.keys(aggregatedExpenses),
      ...Object.keys(aggregatedSalaries),
      ...Object.keys(aggregatedVouchers),
      ...Object.keys(aggregatedLedger),
      ...Object.keys(aggregatedAppraisals),
    ])
  ].sort();

  const filterAndAggregateData = () => {
    const filteredDates = allDates.filter(date => {
      const dateField = new Date(date);
      return (!startDate || !endDate) || (dateField >= new Date(startDate) && dateField <= new Date(endDate));
    });

    let prevClosingBalance = 0; // Start with zero or initial balance
    return filteredDates.map(date => {
      const openingBalance = prevClosingBalance;
      const closingBalance = calculateClosingBalance(openingBalance, date);
      prevClosingBalance = closingBalance; // Update for the next date

      return {
        date,
        openingBalance: formatNumber(openingBalance),
        dayToDayExpenses: aggregatedExpenses[date] || { date: date, totalAmount: 0 },
        salaries: aggregatedSalaries[date] || { date: date, totalAmount: 0 },
        vouchers: aggregatedVouchers[date] || { date: date, totalAmount: 0 },
        ledger: aggregatedLedger[date] || { date: date, totalAmount: 0 },
        appraisals: aggregatedAppraisals[date] || { date: date, totalAmount: 0 },
        closingBalance: formatNumber(closingBalance),
      };
    });
  };

  const calculateClosingBalance = (prevClosingBalance, date) => {
    const openingBalance = prevClosingBalance;
    const dayToDayTotal = aggregatedExpenses[date]?.totalAmount || 0;
    const salaryTotal = aggregatedSalaries[date]?.totalAmount || 0;
    const voucherTotal = aggregatedVouchers[date]?.totalAmount || 0;
    const ledgerTotal = aggregatedLedger[date]?.totalAmount || 0;
    const appraisalTotal = aggregatedAppraisals[date]?.totalAmount || 0;

    return openingBalance + voucherTotal + appraisalTotal - dayToDayTotal - salaryTotal - ledgerTotal;
  };

  const formatNumber = (number) => {
    const roundedNumber = Math.round(number); // Round to the nearest integer
    return roundedNumber === 0 ? "" : roundedNumber; // Display empty string if zero
  };

  const filteredRows = filterAndAggregateData();

  return (
    <Paper elevation={2} style={{ padding: "20px" }} sx={{ maxWidth: 1080, margin: "auto", mt: 10 }} className="paperbg">
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>
        Day Book
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
          <Typography variant="body1">Start Date:</Typography>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="yyyy-MM-dd" isClearable />
        </Grid>
        <Grid item>
          <Typography variant="body1">End Date:</Typography>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy-MM-dd" isClearable />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Day Book Table
          </Typography>
          <TableContainer component={Paper} sx={{ width: 1000 }} align="center">
            <Table align="center">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: "1px solid black" }}>Opening Balance</TableCell>
                  <TableCell sx={{ border: "1px solid black" }} colSpan={2}>Day To Day Expenses</TableCell>
                  <TableCell sx={{ border: "1px solid black" }} colSpan={2}>Salary Amount</TableCell>
                  <TableCell sx={{ border: "1px solid black" }} colSpan={2}>Received Amount from Md</TableCell>
                  <TableCell sx={{ border: "1px solid black" }} colSpan={2}>Ledger Loan Amount</TableCell>
                  <TableCell sx={{ border: "1px solid black" }} colSpan={2}>Appraisal Payment</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Closing Balance</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: "1px solid black" }}></TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Total</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Total</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Total</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Total</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Date</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>Total</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid black" }}>{row.openingBalance}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.dayToDayExpenses.date}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.dayToDayExpenses.totalAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.salaries.date}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.salaries.totalAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.vouchers.date}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.vouchers.totalAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.ledger.date}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.ledger.totalAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.appraisals.date}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.appraisals.totalAmount}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>{row.closingBalance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Day-to-Day Expenses
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }} align="center">
            <Table align="center">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: '1px solid black' }}>Product Name</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Total Rupees</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(dayToDayExpenses).map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell sx={{ border: '1px solid black' }}>{expense.productName}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{expense.date}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{expense.totalRupees}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Salary Payments
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: '1px solid black' }}>Employee Name</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Designation</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Salary Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(salaries).map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell sx={{ border: '1px solid black' }}>{payment.employeeName}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{payment.designation}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{payment.date}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{payment.salaryAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vouchers
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: '1px solid black' }}>Name</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Amount</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Purpose</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(vouchers).map((voucher) => (
                  <TableRow key={voucher._id}>
                    <TableCell sx={{ border: '1px solid black' }}>{voucher.name}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{voucher.amount}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{voucher.date}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{voucher.purposeOfAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Ledger Entries
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead>
              <TableRow>
                  <TableCell sx={{ border: '1px solid black' }}>Customer ID</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Customer Name</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>IW</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(ledgerEntries).map((entry) => (
                  <TableRow key={entry._id}>
                   <TableCell sx={{ border: '1px solid black' }}>{entry.customerId}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.date}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.customerName}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.iw}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.date}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{entry.loanAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Appraisal Entries
          </Typography>
          <TableContainer component={Paper} sx={{ width: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell sx={{ border: '1px solid black' }}>Customer ID</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Date</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Principle Paid</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Interest Paid</TableCell>
                  <TableCell sx={{ border: '1px solid black' }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterDataByDateRange(apraisalentries).map((appraisal) => (
                  <TableRow key={appraisal._id}>
                    <TableCell sx={{ border: '1px solid black' }}>{appraisal.customerId}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{appraisal.paymentDate}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{appraisal.interestamount}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{appraisal.interestPrinciple}</TableCell>
                    <TableCell sx={{ border: '1px solid black' }}>{appraisal.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Reminders;

import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCogs, 
  faUser, 
  faMoneyBillWave, 
  faRedo, 
  faBook, 
  faBell, 
  faTools,
  faCoins, 
  faTags, 
  faMoneyCheckAlt,
  faUsers, 
  faAddressCard, 
  faChartBar,
  faReceipt, faUserShield, faKey 
} from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import './Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const { permissions } = useAuth();
  const location = useLocation();

  // State to handle submodule toggle under 'Master Entry'
  const [masterSubOpen, setMasterSubOpen] = useState(false);
  // State to handle submodule toggle under 'Expenses'
  const [expensesSubOpen, setExpensesSubOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: faHome, label: 'Dashboard', permission: 'Dashboard' },
    { 
      path: '/master', icon: faCogs, label: 'Ledger Entry', permission: 'Master', 
      submodules: [
        { path: '/master/loan', icon: faCoins, label: 'Gold Loan Schema', permission: 'Master' },
        { path: '/master/category', icon: faTags, label: 'Gold Loan Entry', permission: 'Master' },
        { path: '/master/amount', icon: faMoneyCheckAlt, label: 'Gold Loan Amount', permission: 'Master' },
      ]
    },
    { path: '/customer', icon: faUser, label:'Customer Management', permission: 'Customer' },
    { path: '/branch', icon: faMoneyBillWave, label:'Branch Management', permission: 'Branch Management' },
    { path: '/report', icon: faChartBar, label:'Appraisal Schema', permission: 'Report' },
    { path: '/voucher', icon: faReceipt, label: 'Voucher', permission: 'Voucher' },
    { path: '/admin_man', icon: faAddressCard, label: 'Admin Management', permission: 'Admin Management' },
    { path: '/repledge', icon: faRedo, label: 'Repledge', permission: 'Repledge' },
    { path: '/loan_retrieved', icon: faRedo, label: 'Loan Retrieved', permission: 'Loan Retrieved' },
    { path: '/root_man', icon: faUsers, label: 'Root Management', permission: 'Root Management' },
    { 
      path: '/expenses', icon: faBook, label: 'Expenses', permission: 'Expenses',
      submodules: [
        { path: '/expenses/salary-payment', icon: faMoneyBillWave, label: 'Salary Payment', permission: 'Expenses' },
       
      ] 
    },
    { path: '/reminders', icon: faBell, label: 'Day Book', permission: 'Reminders' },
    { path: '/tools', icon: faTools, label: 'Expense Voucher', permission: 'Tools' },
    { path: '/books', icon: faBook, label: 'Bill Book', permission: 'Books' },
    { path: '/added_admin', icon: faUserShield, label: 'Added Admin', permission: 'Added Admin' },
    { path: '/new_root', icon: faKey, label: 'RootAdmin Password', permission: 'Added Root' },
  ];

  const toggleMasterSubOpen = () => {
    setMasterSubOpen(!masterSubOpen);
  };

  // Function to toggle submodules under 'Expenses'
  const toggleExpensesSubOpen = () => {
    setExpensesSubOpen(!expensesSubOpen);
  };

  return (
    <Nav className={`flex-column sidebar ${isOpen ? 'open' : ''}`}>
      {navItems.map(item => {
        const hasPermission = permissions.includes(item.permission);
        if (!hasPermission) return null;

        const isActive = location.pathname.startsWith(item.path);
        const linkStyle = isActive ? 'nav-link active' : 'nav-link';
        const iconStyle = isActive ? 'icons active' : 'icons';
        const arrowIconStyle = isActive ? 'dropdown-icon active' : 'dropdown-icon';

        return (
          <React.Fragment key={item.path}>
            <Link to={item.path} className={linkStyle}>
              <FontAwesomeIcon icon={item.icon} className={iconStyle} />{' '} {item.label}
              {item.permission === 'Master' && (
                <span className={arrowIconStyle} onClick={toggleMasterSubOpen}>
                  {masterSubOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </span>
              )}
              {item.permission === 'Expenses' && (
                <span className={arrowIconStyle} onClick={toggleExpensesSubOpen}>
                  {expensesSubOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </span>
              )}
            </Link>
            {item.submodules && item.path === '/master' && masterSubOpen && (
              <Nav className="flex-column ml-3">
                {item.submodules.map(sub => {
                  const isSubActive = location.pathname.startsWith(sub.path);
                  const subLinkStyle = isSubActive ? 'nav-links active' : 'nav-links';
                  const subIconStyle = isSubActive ? 'sub-icon active' : 'sub-icon';

                  return (
                    <Link key={sub.path} to={sub.path} className={subLinkStyle}>
                      <FontAwesomeIcon icon={sub.icon} className={subIconStyle} />{' '} {sub.label}
                    </Link>
                  );
                })}
              </Nav>
            )}
            {item.submodules && item.path === '/expenses' && expensesSubOpen && (
              <Nav className="flex-column ml-3">
                {item.submodules.map(sub => {
                  const isSubActive = location.pathname.startsWith(sub.path);
                  const subLinkStyle = isSubActive ? 'nav-links active' : 'nav-links';
                  const subIconStyle = isSubActive ? 'sub-icon active' : 'sub-icon';

                  return (
                    <Link key={sub.path} to={sub.path} className={subLinkStyle}>
                      <FontAwesomeIcon icon={sub.icon} className={subIconStyle} />{' '} {sub.label}
                    </Link>
                  );
                })}
              </Nav>
            )}
          </React.Fragment>
        );
      })}
    </Nav>
  );
};

export default Sidebar;

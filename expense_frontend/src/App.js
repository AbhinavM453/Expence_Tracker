import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Register from "./modules/user/Register";
import Login from "./modules/user/Login";
import Profile from "./modules/user/Profile";
import UserHome from "./modules/user/UserHome";
import EditProfile from "./modules/user/EditProfile";
import ChangePassword from "./modules/user/ChangePassword";
import ForgotPassword from "./modules/user/ForgotPassword";
import RequestOtp from "./modules/user/RequestOtp";
import ResetPassword from "./modules/user/ResetPassword";

import CategoryPage from "./modules/category/CategoryPage";
import ExpensePage from "./modules/expense/ExpensePage";

import BudgetPage from "./modules/budget/BudgetPage";
import AddBudget from "./modules/budget/AddBudget";
import EditBudget from "./modules/budget/EditBudget";
import AnalyticsDashboard from "./modules/analytics/AnalyticsDashboard";
import AIInsights from "./modules/ai/AIInsights";
import AIPredict from "./modules/ai/AIPredict";
import FinanceChatbot from "./modules/ai/FinanceChatbot";

import IncomeAdd from "./modules/income/IncomeAdd";
import IncomeEdit from "./modules/income/IncomeEdit";
import IncomeList from "./modules/income/IncomeList";




function App() {
  return (
    <Router>
      <Routes>

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* User Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/request" element={<RequestOtp />} />
        <Route path="/password-reset/confirm" element={<ResetPassword />} />

        {/* Category & Expense */}
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/expenses" element={<ExpensePage />} />
       
       <Route path="/budget" element={<BudgetPage />} />
        <Route path="/add-budget" element={<AddBudget />} />
        <Route path="/edit-budget/:id" element={<EditBudget />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />

        <Route path="/chatbot" element={<FinanceChatbot />} />
  <Route path="/insights" element={<AIInsights />} />
  <Route path="/predict" element={<AIPredict />} />

  <Route path="/income" element={<IncomeList />} />
        <Route path="/income/add" element={<IncomeAdd />} />
        <Route path="/income/edit/:id" element={<IncomeEdit />} />

      </Routes>
    </Router>
  );
}

export default App;

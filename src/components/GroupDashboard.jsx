import React, { useEffect, useState } from "react";
import API from "../api/api";
import ExpenseTable from "./ExpenseTable";
import AddExpenseForm from "./AddExpenseForm";

const GroupDashboard = ({ groupId }) => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/groups/${groupId}/dashboard`);
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (groupId) fetchExpenses();
  }, [groupId]);

  return (
    <div>
      <h2>Group Dashboard</h2>
      <AddExpenseForm groupId={groupId} onExpenseAdded={fetchExpenses} />
      <ExpenseTable expenses={expenses} />
    </div>
  );
};

export default GroupDashboard;

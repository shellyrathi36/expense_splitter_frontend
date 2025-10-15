import React, { useState } from "react";
import API from "../api/api";

const AddExpenseForm = ({ groupId, onExpenseAdded }) => {
  const [form, setForm] = useState({
    expenseName: "",
    description: "",
    amount: "",
    category: "Food",
    sharedWith: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses/add", { ...form, groupId });
      onExpenseAdded(); // refresh list
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="expenseName"
        placeholder="Expense Name"
        value={form.expenseName}
        onChange={handleChange}
        required
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Utilities">Utilities</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;

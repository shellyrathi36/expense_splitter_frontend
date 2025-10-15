import React, { useState } from "react";
import API from "../api/api";

const AddExpenseForm = ({ groupId, fetchExpenses, members = [] }) => {
  const [form, setForm] = useState({
    expenseName: "",
    description: "",
    amount: "",
    category: "",
    paidBy: "",
    splitBetween: [],
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckbox = (id) => {
    const newSplit = form.splitBetween.includes(id)
      ? form.splitBetween.filter((uid) => uid !== id)
      : [...form.splitBetween, id];
    setForm({ ...form, splitBetween: newSplit });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses/add", { ...form, groupId });
      fetchExpenses(); // refresh list
      setForm({
        expenseName: "",
        description: "",
        amount: "",
        category: "",
        paidBy: "",
        splitBetween: [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-2">Add Expense</h3>
      <input
        type="text"
        name="expenseName"
        placeholder="Expense Name"
        value={form.expenseName}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      <label className="block mb-2">
        Paid By:
        <select
          name="paidBy"
          value={form.paidBy}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select</option>
          {(members || []).map((m) => (
            <option key={m._id} value={m._id}>
              {m.username}
            </option>
          ))}
        </select>
      </label>

      <div className="mb-2">
        <span className="block mb-1">Split Between:</span>
        {(members || []).map((m) => (
          <label key={m._id} className="mr-2">
            <input
              type="checkbox"
              checked={form.splitBetween.includes(m._id)}
              onChange={() => handleCheckbox(m._id)}
            />{" "}
            {m.username}
          </label>
        ))}
      </div>

      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Expense
      </button>
    </form>
  );
};

export default AddExpenseForm;

import React from "react";

const ExpenseTable = ({ expenses }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
          <th>Paid By</th>
          <th>Shared With</th>
          <th>Category</th>
          <th>Date</th>
          <th>Settled</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp._id}>
            <td>{exp.expenseName}</td>
            <td>{exp.amount}</td>
            <td>{exp.paidBy}</td>
            <td>{exp.sharedWith.join(", ")}</td>
            <td>{exp.category}</td>
            <td>{new Date(exp.date).toLocaleDateString()}</td>
            <td>{exp.settled ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseTable;

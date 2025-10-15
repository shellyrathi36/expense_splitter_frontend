import React from "react";
import API from "../api/api";

const ExpenseList = ({ expenses, fetchExpenses }) => {
  const settleExpense = async (id) => {
    try {
      await API.patch("/expenses/settle", { expenseId: id });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded flex flex-col space-y-2">
      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        expenses.map((exp) => (
          <div
            key={exp._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <strong>{exp.expenseName}</strong> - ${exp.amount} ({exp.category}
              )
              <br />
              Paid by: {exp.paidBy.username}
              <br />
              Split between:{" "}
              {exp.splitBetween.map((u) => u.username).join(", ")}
            </div>
            {!exp.settled && (
              <button
                onClick={() => settleExpense(exp._id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Settle
              </button>
            )}
            {exp.settled && (
              <span className="text-gray-500 italic">Settled</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;

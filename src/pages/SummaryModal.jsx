import React from "react";

const SummaryModal = ({ summaryData, setShowSummaryModal }) => {
  const expenses = summaryData?.expenses || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold">
            Group Expenses — {summaryData?.groupName || "Group"}
          </h3>
          <button
            onClick={() => setShowSummaryModal(false)}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        <div className="overflow-x-auto">
          {expenses.length > 0 ? (
            <table className="w-full text-sm border-collapse border">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2 text-left">Owner</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Expense</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Shared With</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.expenseId} className="border-b hover:bg-gray-50">
                    <td className="p-2">{exp.owner.name}</td>
                    <td className="p-2 text-gray-600">{exp.owner.email}</td>
                    <td className="p-2">{exp.expenseName}</td>
                    <td className="p-2">{exp.category}</td>
                    <td className="p-2">₹{exp.amount.toFixed(2)}</td>
                    <td className="p-2">
                      {exp.sharedWith.length > 0
                        ? exp.sharedWith.map((s) => s.name).join(", ")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-6">
              No expenses found for this group.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 font-medium transition"
            onClick={() => setShowSummaryModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;

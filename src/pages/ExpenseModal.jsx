import React from "react";

const ExpenseModal = ({
  activeGroup,
  expenseForm,
  setExpenseForm,
  handleExpenseSubmit,
  setActiveGroup,
}) => {
  if (!activeGroup) return null;

  const handleSplitChange = (memberId) => {
    setExpenseForm((prev) => {
      const exists = prev.splitBetween.includes(memberId);
      return {
        ...prev,
        splitBetween: exists
          ? prev.splitBetween.filter((id) => id !== memberId)
          : [...prev.splitBetween, memberId],
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Add Expense – {activeGroup.groupName}
        </h2>

        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          {/* Expense Name */}
          <div>
            <label className="block font-semibold mb-1">Expense Name</label>
            <input
              type="text"
              value={expenseForm.expenseName}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, expenseName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <input
              type="text"
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-semibold mb-1">Amount</label>
            <input
              type="number"
              min="0"
              value={expenseForm.amount}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, amount: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <input
              type="text"
              value={expenseForm.category}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, category: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Paid By Dropdown */}
          <div>
            <label className="block font-semibold mb-1">Paid By</label>
            <select
              value={expenseForm.paidBy}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, paidBy: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Member</option>
              {activeGroup.members?.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name || member.email}
                </option>
              ))}
            </select>
          </div>

          {/* Split Between */}
          <div>
            <label className="block font-semibold mb-1">Split Between</label>
            <div className="flex flex-wrap gap-3">
              {activeGroup.members?.map((member) => (
                <label
                  key={member._id}
                  className="flex items-center space-x-2 border p-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={expenseForm.splitBetween.includes(member._id)}
                    onChange={() => handleSplitChange(member._id)}
                  />
                  <span>{member.name || member.email}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveGroup(null)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;

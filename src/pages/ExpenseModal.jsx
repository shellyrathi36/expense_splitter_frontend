import React from "react";

const ExpenseModal = ({
  activeGroup,
  expenseForm,
  setExpenseForm,
  handleExpenseSubmit,
  setActiveGroup,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
    <form
      onSubmit={handleExpenseSubmit}
      className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg"
    >
      <h3 className="text-lg font-semibold mb-4">
        Add Expense — {activeGroup.name}
      </h3>

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Expense name"
        value={expenseForm.expenseName}
        onChange={(e) =>
          setExpenseForm({ ...expenseForm, expenseName: e.target.value })
        }
        required
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Amount"
        type="number"
        step="0.01"
        value={expenseForm.amount}
        onChange={(e) =>
          setExpenseForm({ ...expenseForm, amount: e.target.value })
        }
        required
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Category"
        value={expenseForm.category}
        onChange={(e) =>
          setExpenseForm({ ...expenseForm, category: e.target.value })
        }
        required
      />

      <label className="block text-sm font-medium mb-1">Paid by</label>
      <select
        className="w-full p-2 border rounded mb-3"
        value={expenseForm.paidBy}
        onChange={(e) =>
          setExpenseForm({ ...expenseForm, paidBy: e.target.value })
        }
        required
      >
        <option value="">-- Select payer --</option>
        {activeGroup.members.map((m) => (
          <option key={m._id} value={String(m._id)}>
            {m.name}
          </option>
        ))}
      </select>

      <div className="mb-3">
        <div className="text-sm font-medium mb-1">Split between</div>
        <div className="grid grid-cols-2 gap-1 max-h-28 overflow-y-auto">
          {activeGroup.members.map((m) => (
            <label key={m._id} className="text-sm flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={expenseForm.splitBetween.includes(String(m._id))}
                onChange={() => {
                  const idStr = String(m._id);
                  const updated = expenseForm.splitBetween.includes(idStr)
                    ? expenseForm.splitBetween.filter((id) => id !== idStr)
                    : [...expenseForm.splitBetween, idStr];
                  setExpenseForm({ ...expenseForm, splitBetween: updated });
                }}
              />
              {m.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
          onClick={() => setActiveGroup(null)}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
        >
          Add Expense
        </button>
      </div>
    </form>
  </div>
);

export default ExpenseModal;

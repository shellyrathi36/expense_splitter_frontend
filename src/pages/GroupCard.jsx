import React, { useState } from "react";

const GroupCard = ({
  grp,
  findMemberName,
  handleOpenExpense,
  handleClearExpense,
  handleSummary,
  handleAddMember, // ✅ receive function from Group.jsx
}) => {
  const [newMemberEmail, setNewMemberEmail] = useState("");

  const onAddMemberSubmit = (e) => {
    e.preventDefault();
    if (newMemberEmail.trim()) {
      handleAddMember(grp._id, newMemberEmail); // pass groupId & email
      setNewMemberEmail("");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between h-72">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 tracking-wide mb-2">
          {grp.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
            {grp.members?.length || 0} Members
          </span>
          <span className="text-gray-400 text-xs">
            ID: {grp._id?.slice(-6).toUpperCase()}
          </span>
        </div>

        <div className="mt-4 border-t pt-3">
          <p className="text-sm text-gray-500 italic">
            Manage your group’s shared expenses easily.
          </p>

          {/* ✅ Add Member Form */}
          <form
            onSubmit={onAddMemberSubmit}
            className="mt-3 flex gap-2 items-center"
          >
            <input
              type="email"
              placeholder="Member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="p-2 border rounded flex-1 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </form>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:scale-105"
          onClick={() => handleOpenExpense(grp)}
        >
          + Add Expense
        </button>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:scale-105"
          onClick={() => handleSummary(grp._id)}
        >
          📊 Summary
        </button>
      </div>
    </div>
  );
};

export default GroupCard;

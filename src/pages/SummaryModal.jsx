import React, { useState } from "react";
import axios from "axios";

const SummaryModal = ({
  summaryData,
  setShowSummaryModal,
  token,
  fetchSummary,
}) => {
  const [loadingMember, setLoadingMember] = useState(null);

  const handleClearMemberBalance = async (groupId, memberId) => {
    try {
      const token = localStorage.getItem("token");

      setLoadingMember(memberId);
      await axios.put(
        `http://localhost:3000/api/groups/${groupId}/member/${memberId}/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSummary(groupId);
    } catch (err) {
      console.error("Error clearing member balance:", err);
    } finally {
      setLoadingMember(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800">
            Summary — {summaryData.groupName}
          </h3>
          <button
            onClick={() => setShowSummaryModal(false)}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-2 text-left">Member</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Balance (₹)</th>
                <th className="p-2 text-left">Expenses</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.members.map((m) => (
                <tr key={m._id} className="border-b align-top hover:bg-gray-50">
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{m.email}</td>
                  <td
                    className={`p-2 font-medium ${
                      m.balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {m.balance.toFixed(2)}
                  </td>
                  <td className="p-2">
                    {m.expenses && m.expenses.length > 0 ? (
                      <ul className="list-disc list-inside text-xs">
                        {m.expenses.map((exp, i) => (
                          <li key={i}>{exp}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-xs">No expenses</span>
                    )}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() =>
                        handleClearMemberBalance(summaryData.groupId, m._id)
                      }
                      disabled={loadingMember === m._id}
                      className={`text-white text-xs px-3 py-1 rounded-lg font-medium transition ${
                        loadingMember === m._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {loadingMember === m._id ? "Clearing..." : "Clear"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
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

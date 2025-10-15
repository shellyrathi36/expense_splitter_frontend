import React, { useState } from "react";
import axios from "axios";

const SummaryModal = ({
  summaryData,
  setShowSummaryModal,
  token,
  fetchSummary,
}) => {
  const [loadingMember, setLoadingMember] = useState(null); // Track which member is being cleared

  const handleClearMemberBalance = async (groupId, memberId) => {
    try {
      setLoadingMember(memberId); // start loading
      await axios.put(
        `/api/groups/${groupId}/member/${memberId}/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchSummary(groupId); // refresh summary after clearing
    } catch (err) {
      console.error("Error clearing member balance:", err);
    } finally {
      setLoadingMember(null); // stop loading
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          Summary — {summaryData.groupName}
        </h3>

        <table className="w-full text-sm border-collapse border mb-4">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Member</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Balance (₹)</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.members.map((m) => (
              <tr key={m._id} className="border-b">
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.email}</td>
                <td
                  className={`p-2 ${
                    m.balance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {m.balance.toFixed(2)}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() =>
                      handleClearMemberBalance(summaryData.groupId, m._id)
                    }
                    disabled={loadingMember === m._id}
                    className={`text-white text-xs px-2 py-1 rounded ${
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

        <div className="flex justify-end">
          <button
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
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

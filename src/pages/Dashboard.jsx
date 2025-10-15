import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [amountToPay, setAmountToPay] = useState(0);
  const [amountToReceive, setAmountToReceive] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupBalances, setGroupBalances] = useState([]);

  const userToken = localStorage.getItem("token");

  // Fetch all groups and summary
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/dashboard/dash",
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );

        const dashboardData = res.data.dashboard || [];

        let totalOwe = 0;
        let totalReceive = 0;
        dashboardData.forEach((grp) => {
          totalOwe += grp.owedByUser;
          totalReceive += grp.owedToUser;
        });

        setAmountToPay(totalOwe);
        setAmountToReceive(totalReceive);
        setGroups(dashboardData);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchDashboard();

    // Listen for updates from Group component
    const handleUpdate = () => fetchDashboard();
    window.addEventListener("dashboardUpdate", handleUpdate);

    return () => window.removeEventListener("dashboardUpdate", handleUpdate);
  }, [userToken]);

  // Fetch balances for selected group
  const openGroupModal = async (group) => {
    setSelectedGroup(group);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/groups/${group.groupId}/balance-details`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      const { balanceDetails } = res.data;
      setGroupBalances(balanceDetails);
    } catch (err) {
      console.error("Error fetching group balances:", err);
      setGroupBalances([]);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Dashboard</h2>

      {/* Top Summary */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <div className="flex-1 p-4 bg-red-100 text-red-700 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Amount You Owe</h3>
          <p className="text-2xl font-bold">₹{amountToPay.toFixed(2)}</p>
        </div>
        <div className="flex-1 p-4 bg-green-100 text-green-700 rounded shadow text-center">
          <h3 className="text-lg font-semibold mb-2">Amount Others Owe You</h3>
          <p className="text-2xl font-bold">₹{amountToReceive.toFixed(2)}</p>
        </div>
      </div>

      {/* Groups List */}
      <h3 className="text-xl font-bold mb-4">Your Groups</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div
            key={group.groupId}
            className="p-4 border rounded shadow hover:shadow-lg cursor-pointer transition"
            onClick={() => openGroupModal(group)}
          >
            <h4 className="font-semibold mb-2">{group.groupName}</h4>
            <p className="mb-1">
              <span className="font-medium">You Owe:</span> ₹
              {group.owedByUser.toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Owed To You:</span> ₹
              {group.owedToUser.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-xl font-bold"
              onClick={() => {
                setSelectedGroup(null);
                setGroupBalances([]);
              }}
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">
              {selectedGroup.groupName} - Member Balances
            </h3>

            <table className="w-full table-auto border-collapse border mb-4">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Member</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Balance</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {groupBalances.map((b) => (
                  <tr key={b.id} className="border-b">
                    <td className="p-2">{b.name}</td>
                    <td className="p-2">{b.email}</td>
                    <td
                      className={`p-2 ${
                        b.type === "owedToUser"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹{b.amount.toFixed(2)}
                    </td>
                    <td className="p-2">
                      {b.type === "owedToUser" ? "To Receive" : "To Pay"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

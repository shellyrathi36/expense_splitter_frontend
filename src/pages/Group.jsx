import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupList from "./GroupList.jsx";
import ExpenseModal from "./ExpenseModal.jsx";
import SummaryModal from "./SummaryModal.jsx";

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    return decoded.id || decoded.userId || null;
  } catch {
    return null;
  }
}

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState("");
  const [activeGroup, setActiveGroup] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    expenseName: "",
    description: "",
    amount: "",
    category: "",
    paidBy: "",
    splitBetween: [],
  });
  const [summaryData, setSummaryData] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const userToken = localStorage.getItem("token");
  const loggedInUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/groups/my-groups",
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        const normalized = (res.data.groups || []).map((g) => ({
          ...g,
          expenses: g.expenses || [],
        }));
        setGroups(normalized);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setMessage(err?.response?.data?.message || "Failed to load groups");
      }
    };
    fetchGroups();
  }, [userToken]);

  const findMemberName = (group, memberId) => {
    if (!group?.members) return "Unknown";
    const m = group.members.find((x) => String(x._id) === String(memberId));
    return m ? m.name || m.email || "Unknown" : "Unknown";
  };

  const handleOpenExpense = (group) => {
    const defaultSplit = group.members.map((m) => String(m._id));
    setActiveGroup(group);
    setExpenseForm({
      expenseName: "",
      description: "",
      amount: "",
      category: "",
      paidBy: String(loggedInUserId || ""),
      splitBetween: defaultSplit,
    });
    setMessage("");
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!activeGroup) return;
    if (
      !expenseForm.expenseName ||
      !expenseForm.amount ||
      !expenseForm.category ||
      !expenseForm.paidBy ||
      expenseForm.splitBetween.length === 0
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        group: activeGroup._id,
        expenseName: expenseForm.expenseName,
        description: expenseForm.description || expenseForm.expenseName,
        amount: Number(expenseForm.amount),
        owner: expenseForm.paidBy,
        sharedWith: expenseForm.splitBetween,
        category: expenseForm.category,
      };

      const res = await axios.post(
        "http://localhost:3000/api/expenses/add",
        payload,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const returnedExpense = res.data.expense || null;
      const ownerId = returnedExpense?.owner || payload.owner;
      const ownerName = findMemberName(activeGroup, ownerId);

      const uiExpense = {
        _id: returnedExpense?._id || `${Date.now()}`,
        expenseName: returnedExpense?.expenseName || payload.expenseName,
        amount: returnedExpense?.amount ?? payload.amount,
        category: returnedExpense?.category || payload.category,
        owner: { _id: ownerId, name: ownerName },
        sharedWith:
          returnedExpense?.sharedWith ||
          payload.splitBetween.map((id) => ({ user: id })),
      };

      setGroups((prev) =>
        prev.map((g) =>
          String(g._id) === String(activeGroup._id)
            ? { ...g, expenses: [...(g.expenses || []), uiExpense] }
            : g
        )
      );

      setMessage("Expense added successfully");
      setActiveGroup(null);
    } catch (err) {
      console.error("Error adding expense:", err);
      setMessage(err?.response?.data?.message || "Error adding expense");
    }
  };

  const handleClearExpense = async (groupId, expenseId) => {
    if (!confirm("Clear this expense? This will mark it settled.")) return;
    try {
      await axios.post(
        "http://localhost:3000/api/expenses/settle",
        { expenseId },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      setGroups((prev) =>
        prev.map((g) =>
          String(g._id) === String(groupId)
            ? {
                ...g,
                expenses: (g.expenses || []).filter(
                  (exp) => String(exp._id) !== String(expenseId)
                ),
              }
            : g
        )
      );
      setMessage("Expense cleared successfully");
    } catch (err) {
      console.error("Error clearing expense:", err);
      setMessage(err?.response?.data?.message || "Error clearing expense");
    }
  };

  const handleSummary = async (groupId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/groups/${groupId}/balances`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const { groupName, balances } = res.data;

      const summary = {
        groupId, // <-- important!
        groupName,
        members: balances.map((b) => ({
          _id: b.id,
          name: b.name,
          email: b.email,
          balance: b.balance,
        })),
      };

      setSummaryData(summary);
      setShowSummaryModal(true);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setMessage(err?.response?.data?.message || "Error fetching summary");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Groups</h2>
      {message && <p className="mb-4 text-center text-blue-600">{message}</p>}

      <GroupList
        groups={groups}
        findMemberName={findMemberName}
        handleOpenExpense={handleOpenExpense}
        handleClearExpense={handleClearExpense}
        handleSummary={handleSummary}
      />

      {activeGroup && (
        <ExpenseModal
          activeGroup={activeGroup}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          handleExpenseSubmit={handleExpenseSubmit}
          setActiveGroup={setActiveGroup}
        />
      )}

      {showSummaryModal && summaryData && (
        <SummaryModal
          summaryData={summaryData}
          setShowSummaryModal={setShowSummaryModal}
        />
      )}
    </div>
  );
};

export default Group;

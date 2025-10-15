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
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // ✅ For creating new group
  const [newGroup, setNewGroup] = useState({
    groupName: "",
    memberEmails: "",
  });

  const userToken = localStorage.getItem("token");
  const loggedInUserId = getUserIdFromToken();

  // -------------------------------
  // ✅ FIXED Fetch group summary
  // -------------------------------
  const fetchSummary = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/groups/${groupId}/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { groupName, expenses } = res.data;

      // Normalize expenses to ensure owner and sharedWith are always safe
      const normalizedExpenses = (expenses || []).map((exp) => ({
        expenseId: exp.expenseId,
        expenseName: exp.expenseName,
        category: exp.category,
        amount: exp.amount,
        owner: exp.owner
          ? {
              _id: exp.owner._id,
              name: exp.owner.name || "Unknown",
              email: exp.owner.email || "—",
            }
          : { _id: null, name: "Unknown", email: "—" },
        sharedWith: (exp.sharedWith || []).map((s) => ({
          _id: s._id || null,
          name: s.name || "Unknown",
        })),
      }));

      setSummaryData({
        groupId,
        groupName,
        expenses: normalizedExpenses,
      });

      setShowSummaryModal(true);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setMessage(err?.response?.data?.message || "Error fetching summary");
    }
  };

  // -------------------------------
  // Fetch all groups
  // -------------------------------
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

  // -------------------------------
  // Find Member Name
  // -------------------------------
  const findMemberName = (group, memberId) => {
    if (!group?.members) return "Unknown";
    const m = group.members.find((x) => String(x._id) === String(memberId));
    return m ? m.name || m.email || "Unknown" : "Unknown";
  };

  // -------------------------------
  // Open Expense Modal
  // -------------------------------
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

  // -------------------------------
  // Add Expense
  // -------------------------------
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

  // -------------------------------
  // Clear Expense
  // -------------------------------
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
      if (showSummaryModal) await fetchSummary(groupId);
      window.dispatchEvent(new Event("dashboardUpdate")); // update dashboard
    } catch (err) {
      console.error("Error clearing expense:", err);
      setMessage(err?.response?.data?.message || "Error clearing expense");
    }
  };

  // -------------------------------
  // Add Member by Email
  // -------------------------------
  const handleAddMember = async (groupId, email) => {
    if (!groupId || !email) {
      setMessage("Please provide member email.");
      return;
    }

    try {
      const res = await axios.patch(
        "http://localhost:3000/api/groups/add-member-by-email",
        { groupId, email },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      setGroups((prev) =>
        prev.map((g) =>
          String(g._id) === String(groupId)
            ? { ...g, members: res.data.group.members }
            : g
        )
      );

      setMessage("Member added successfully");
    } catch (err) {
      console.error("Error adding member:", err);
      setMessage(err?.response?.data?.message || "Error adding member");
    }
  };

  // -------------------------------
  // Create New Group
  // -------------------------------
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        groupName: newGroup.groupName,
        emails: newGroup.memberEmails
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
      };

      const res = await axios.post(
        "http://localhost:3000/api/groups/create",
        payload,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      setGroups((prev) => [...prev, res.data.group]);
      setMessage("Group created successfully!");
      setNewGroup({ groupName: "", memberEmails: "" });
    } catch (err) {
      console.error("Error creating group:", err);
      setMessage(err?.response?.data?.message || "Error creating group");
    }
  };

  const handleSummary = async (groupId) => {
    await fetchSummary(groupId);
  };

  // -------------------------------
  // UI Rendering
  // -------------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Groups</h2>
      {message && <p className="mb-4 text-center text-blue-600">{message}</p>}

      {/* ✅ Create Group Form */}
      <form
        onSubmit={handleCreateGroup}
        className="p-4 bg-white rounded shadow mb-6 flex flex-col md:flex-row gap-2 items-center"
      >
        <input
          type="text"
          placeholder="Group Name"
          value={newGroup.groupName}
          onChange={(e) =>
            setNewGroup({ ...newGroup, groupName: e.target.value })
          }
          className="p-2 border rounded flex-1"
          required
        />
        <input
          type="text"
          placeholder="Member Emails (comma separated)"
          value={newGroup.memberEmails}
          onChange={(e) =>
            setNewGroup({ ...newGroup, memberEmails: e.target.value })
          }
          className="p-2 border rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Group
        </button>
      </form>

      {/* Group List */}
      <GroupList
        groups={groups}
        findMemberName={findMemberName}
        handleOpenExpense={handleOpenExpense}
        handleClearExpense={handleClearExpense}
        handleSummary={handleSummary}
        handleAddMember={handleAddMember}
      />

      {/* Expense Modal */}
      {activeGroup && (
        <ExpenseModal
          activeGroup={activeGroup}
          expenseForm={expenseForm}
          setExpenseForm={setExpenseForm}
          handleExpenseSubmit={handleExpenseSubmit}
          setActiveGroup={setActiveGroup}
        />
      )}

      {/* ✅ Fixed Summary Modal */}
      {showSummaryModal && summaryData && (
        <SummaryModal
          summaryData={summaryData}
          setShowSummaryModal={setShowSummaryModal}
          fetchSummary={fetchSummary}
        />
      )}
    </div>
  );
};

export default Group;

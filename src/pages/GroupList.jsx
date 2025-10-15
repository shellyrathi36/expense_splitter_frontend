import React from "react";
import GroupCard from "./GroupCard.jsx";

const GroupList = ({
  groups,
  findMemberName,
  handleOpenExpense,
  handleClearExpense,
  handleSummary,
  handleAddMember, // ✅ receive it here
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((grp) => (
        <GroupCard
          key={grp._id}
          grp={grp}
          findMemberName={findMemberName}
          handleOpenExpense={handleOpenExpense}
          handleClearExpense={handleClearExpense}
          handleSummary={handleSummary}
          handleAddMember={handleAddMember} // ✅ pass it down
        />
      ))}
    </div>
  );
};

export default GroupList;

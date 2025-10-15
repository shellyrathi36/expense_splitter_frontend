import React from "react";

const Faq = () => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">FAQ</h2>
      <ul className="list-disc list-inside">
        <li>
          Q: How do I create a group?
          <br />
          A: Go to the "Group" page and click "Create Group".
        </li>
        <li>
          Q: How are expenses split?
          <br />
          A: Each expense can be split among group members, and the app
          calculates balances automatically.
        </li>
        <li>
          Q: Can I track multiple groups?
          <br />
          A: Yes! You can belong to multiple groups, each with its own expenses.
        </li>
      </ul>
    </div>
  );
};

export default Faq;

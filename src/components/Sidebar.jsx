import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

const Sidebar = ({ groups, setSelectedGroup }) => {
  const sidebarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Animate sidebar on open/close
  useEffect(() => {
    gsap.to(sidebarRef.current, {
      x: isOpen ? 0 : "-100%",
      duration: 0.5,
      ease: "power3.out",
    });
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        sidebar
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 p-6 transform -translate-x-full md:translate-x-0 md:relative md:shadow-none"
      >
        <h3 className="text-xl font-bold mb-4">Groups</h3>
        <div className="flex flex-col space-y-2">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => {
                setSelectedGroup(group._id);
                setIsOpen(false); // Close sidebar on mobile after selection
              }}
              className="text-left px-3 py-2 rounded hover:bg-blue-100 transition"
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

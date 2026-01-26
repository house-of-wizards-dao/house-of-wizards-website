"use client";

export const ScrollToTeamButton = () => {
  return (
    <button
      aria-label="Scroll to team section"
      className="bg-violet text-white px-8 py-3 rounded-full hover:bg-violet-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet focus:ring-opacity-50 font-medium shadow-lg hover:shadow-xl"
      onClick={() => {
        document.getElementById("team-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }}
    >
      Meet the Team
    </button>
  );
};

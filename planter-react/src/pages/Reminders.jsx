import React from "react";
import ReminderPlanner from "../components/ReminderPlanner"; // ✅ Import the component

const reminderData = {
  date_tz: "2025-03-12",
  time_tz: "10:00:00",
  rrule: "FREQ=DAILY;COUNT=5", // Example recurrence rule
};

const Reminders = () => {
  return (
    <div>
      <h1>My Reminders</h1>
      <ReminderPlanner reminderData={reminderData} /> {/* ✅ Use the component */}
    </div>
  );
};

export default Reminders;

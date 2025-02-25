export const renderHabit = (habits: any) => {
  console.log("HABITS FROM RENDERER", habits);

  return (
    <div>
      <h1>HABIT DATA DEBUG</h1>
      {habits.map((h: any) => (
        <div key={h.id}>
          ID: {h.id}
          <br />
          Title: {h.title}
          <br />
          Units: {h.units}
          <br />
          {h.units === 'CUSTOM' && `Custom Unit: ${h.customUnit}`}
          <br />
          Amt. Req.: {h.amountRequired}
          <br />
          Amt. Done: {h.amountDone}
          <br />
          Daily Streak: {h.dailyStreak}
          <br />
          Is Completed Today: {h.isCompletedToday ? 'YES' : 'NO'}
          <br />
          <br />
        </div>
      ))}
    </div>
  );
};

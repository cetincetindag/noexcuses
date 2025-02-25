class HabitCronService {
  async resetHabits() {
    fetch('/api/crons/resetHabits', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CRON_SECRET}`
      }
    })
    return;
  }
}

// Utility function to check and generate recurring tasks
// Call this when the user opens the dashboard

export const checkAndGenerateRecurringTasks = async (userID, token) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/task/checkAndGenerateRecurringTasks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userID }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Generated ${data.generatedCount} recurring task instances`);
      return data.generatedCount;
    }
  } catch (error) {
    console.error('Error checking recurring tasks:', error);
  }
  return 0;
};

// Helper function to format recurrence pattern for display
export const formatRecurrencePattern = (recurrence) => {
  if (!recurrence || !recurrence.enabled) {
    return null;
  }

  const { pattern, interval, daysOfWeek, dayOfMonth, monthOfYear } = recurrence;

  const daysOfWeekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  switch (pattern) {
    case 'daily':
      return interval === 1 ? 'Daily' : `Every ${interval} days`;
    
    case 'weekly':
      if (daysOfWeek && daysOfWeek.length > 0) {
        const days = daysOfWeek.map(d => daysOfWeekLabels[d]).join(', ');
        return interval === 1 
          ? `Weekly on ${days}` 
          : `Every ${interval} weeks on ${days}`;
      }
      return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
    
    case 'monthly':
      return `Monthly on day ${dayOfMonth}`;
    
    case 'yearly':
      return `Yearly on ${monthLabels[monthOfYear - 1]} ${dayOfMonth}`;
    
    default:
      return 'Recurring';
  }
};

import React, { useState, useEffect } from 'react';

const RecurrenceSelector = ({ recurrence, onChange }) => {
  const [enabled, setEnabled] = useState(recurrence?.enabled || false);
  const [pattern, setPattern] = useState(recurrence?.pattern || 'daily');
  const [interval, setInterval] = useState(recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState(recurrence?.daysOfWeek || []);
  const [dayOfMonth, setDayOfMonth] = useState(recurrence?.dayOfMonth || 1);
  const [monthOfYear, setMonthOfYear] = useState(recurrence?.monthOfYear || 1);
  const [endDate, setEndDate] = useState(recurrence?.endDate || '');

  const daysOfWeekOptions = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ];

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Update parent component whenever recurrence changes
  useEffect(() => {
    if (onChange) {
      onChange({
        enabled,
        pattern,
        interval,
        daysOfWeek,
        dayOfMonth,
        monthOfYear,
        endDate,
      });
    }
  }, [enabled, pattern, interval, daysOfWeek, dayOfMonth, monthOfYear, endDate]);

  const toggleDayOfWeek = (day) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort((a, b) => a - b));
    }
  };

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="recurrence-enabled"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
        />
        <label htmlFor="recurrence-enabled" className="text-gray-800 font-medium cursor-pointer">
          🔁 Make this a recurring task
        </label>
      </div>

      {enabled && (
        <>
          {/* Pattern Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Repeat Pattern
            </label>
            <select
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Pattern-specific options */}
          {pattern === 'daily' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Repeat every
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <span className="text-gray-700">day(s)</span>
              </div>
            </div>
          )}

          {pattern === 'weekly' && (
            <>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Repeat every
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={interval}
                    onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <span className="text-gray-700">week(s)</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  On these days
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeekOptions.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDayOfWeek(day.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        daysOfWeek.includes(day.value)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {pattern === 'monthly' && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                On day of month
              </label>
              <select
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
                <option value={null}>Last day of month</option>
              </select>
            </div>
          )}

          {pattern === 'yearly' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Month
                </label>
                <select
                  value={monthOfYear}
                  onChange={(e) => setMonthOfYear(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Day
                </label>
                <select
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* End Date (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              End Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(endDate)}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to repeat indefinitely
            </p>
          </div>

          {/* Preview */}
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
            <p className="text-sm font-medium text-indigo-900 mb-1">📅 Recurrence Summary:</p>
            <p className="text-sm text-indigo-700">
              {pattern === 'daily' && `Repeats every ${interval} day${interval > 1 ? 's' : ''}`}
              {pattern === 'weekly' && (
                <>
                  Repeats every {interval} week{interval > 1 ? 's' : ''} on{' '}
                  {daysOfWeek.length > 0
                    ? daysOfWeek.map(d => daysOfWeekOptions.find(opt => opt.value === d)?.label).join(', ')
                    : 'no days selected'}
                </>
              )}
              {pattern === 'monthly' && `Repeats on day ${dayOfMonth} of every month`}
              {pattern === 'yearly' && (
                <>
                  Repeats on {monthOptions.find(m => m.value === monthOfYear)?.label} {dayOfMonth} every year
                </>
              )}
              {endDate && ` until ${new Date(endDate).toLocaleDateString()}`}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default RecurrenceSelector;

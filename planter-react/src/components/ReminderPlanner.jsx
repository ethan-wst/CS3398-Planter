import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Badge, Stack, Tooltip,
  Button, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { RRule } from 'rrule';
import { useTheme } from '@mui/material/styles';

const ReminderPlanner = ({ reminderData }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState([]);
  const [view, setView] = useState('month');
  const [newReminder, setNewReminder] = useState({
    text: '',
    date_tz: '',
    time_tz: '',
    rrule: '',
  });

  const theme = useTheme();
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = view === 'month'
    ? eachDayOfInterval({ start: monthStart, end: monthEnd })
    : eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    if (!reminderData) return;

    let startDate = new Date(`${reminderData.date_tz}T${reminderData.time_tz}`);
    const today = new Date();

    if (startDate < today) startDate = today;

    const rule = RRule.fromString(reminderData.rrule);
    const recurringDates = rule.between(startDate, new Date(2025, 12, 31), true);

    setEvents(recurringDates);
    setMarkedDates(recurringDates.map(date => format(date, 'yyyy-MM-dd')));
  }, [reminderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };

  const handleAddReminder = () => {
    const { text, date_tz, time_tz, rrule } = newReminder;
    if (!text || !date_tz || !time_tz || !rrule) return alert('Please fill all fields');

    const startDate = new Date(`${date_tz}T${time_tz}`);
    const rule = RRule.fromString(rrule);
    const newDates = rule.between(startDate, new Date(2025, 12, 31), true);

    setEvents(prev => [...prev, ...newDates]);
    setMarkedDates(prev => [...prev, ...newDates.map(d => format(d, 'yyyy-MM-dd'))]);

    setNewReminder({ text: '', date_tz: '', time_tz: '', rrule: '' });
  };

  const weeks = [];
  let currentWeek = [];
  const firstDay = days[0].getDay();
  for (let i = 0; i < firstDay; i++) currentWeek.push(null);

  days.forEach(day => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  while (currentWeek.length < 7) currentWeek.push(null);
  weeks.push(currentWeek);

  return (
    <Stack spacing={3} sx={{ p: 2 }}>
      <Typography variant="h5">Reminders</Typography>

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e, nextView) => nextView && setView(nextView)}
        aria-label="View toggle"
      >
        <ToggleButton value="month">Month</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
      </ToggleButtonGroup>

      <Stack direction="row" spacing={1}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <Box key={day} sx={{ flex: 1 }}>
            <Typography variant="subtitle2" align="center">{day}</Typography>
          </Box>
        ))}
      </Stack>

      {weeks.map((week, i) => (
        <Stack direction="row" spacing={1} key={i}>
          {week.map((day, j) => (
            <Box key={j} sx={{ flex: 1 }}>
              {day && (
                <Paper
                  elevation={1}
                  onClick={() => setSelectedDate(day)}
                  sx={{
                    p: 1,
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor:
                      format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                        ? theme.palette.action.selected
                        : theme.palette.background.paper,
                    opacity: isSameMonth(day, currentDate) ? 1 : 0.4,
                    cursor: 'pointer',
                  }}
                >
                  <Typography variant="body2">{format(day, 'd')}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {markedDates.includes(format(day, 'yyyy-MM-dd')) && (
                      <Tooltip title="Reminder">
                        <Badge badgeContent={1} color="secondary">
                          <AssignmentIcon sx={{ fontSize: '1rem' }} />
                        </Badge>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              )}
            </Box>
          ))}
        </Stack>
      ))}

      <Box>
        <Typography variant="h6">Reminders for {selectedDate.toDateString()}</Typography>
        <ul>
          {events.filter(e => format(e, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
            .map((e, i) => <li key={i}>{e.toLocaleString()}</li>)}
        </ul>
      </Box>

      <Box>
        <Typography variant="h6">Add New Reminder</Typography>
        <Stack spacing={1} direction="row" flexWrap="wrap">
          <TextField name="text" label="Reminder Text" value={newReminder.text} onChange={handleInputChange} />
          <TextField name="date_tz" type="date" value={newReminder.date_tz} onChange={handleInputChange} />
          <TextField name="time_tz" type="time" value={newReminder.time_tz} onChange={handleInputChange} />
          <TextField name="rrule" label="RRULE" placeholder="FREQ=DAILY;INTERVAL=1" value={newReminder.rrule} onChange={handleInputChange} />
          <Button onClick={handleAddReminder} variant="contained">Add Reminder</Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ReminderPlanner;

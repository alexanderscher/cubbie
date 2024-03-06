"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChangeEvent, useRef, useState } from "react";
import { EventInput } from "@fullcalendar/core/index.js";

interface Event {
  title: string;
  start: string | Date;
  end?: string | Date;
  id?: string | number;
}

const CalendarPage = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([
    { title: "Event 1", start: new Date().toISOString(), id: 1 },
    { title: "Event 2", start: new Date().toISOString(), id: 2 },
  ]);

  const calendarRef = useRef<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleMonthChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const year = currentDate.getFullYear();
    const month = parseInt(event.target.value, 10);
    const newDate = new Date(year, month);

    setCurrentDate(newDate);

    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(newDate);
    }
  };

  return (
    <div>
      <select
        onChange={handleMonthChange}
        value={currentDate.getMonth().toString()}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <option key={index} value={index}>
            {new Date(0, index).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "title",
          right: "today prev,next",
        }}
        events={allEvents as EventInput[]}
        nowIndicator={true}
        editable={true}
        selectable={true}
        droppable={true}
        selectMirror={true}
      />
    </div>
  );
};

export default CalendarPage;

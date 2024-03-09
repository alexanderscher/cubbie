"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface Event {
  title: string;
  start: string | Date;
  end?: string | Date;
  id?: string | number;
}

// const allEvents = [
//   { title: "Event 1", start: "2024-03-10T10:00:00", id: 1 },

// ];

const CalendarPage = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([
    { title: "", start: "", id: 0 },
  ]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/receipt");
      const data = await response.json();
      console.log(data);

      // Initialize an empty array to hold all the events
      const events = [];

      for (const receipt of data.receipts) {
        const purchaseEvent = {
          title: `Purchase at ${receipt.store}`,
          start: receipt.purchase_date,
          id: `purchase-${receipt.id}`,

          className: "fc-event-purchase",
        };
        const returnEvent = {
          title: `Return at ${receipt.store}`,
          start: receipt.return_date,
          id: `return-${receipt.id}`,
          className: "fc-event-return",
        };

        events.push(purchaseEvent, returnEvent);
      }

      setAllEvents(events);
    };

    fetchEvents();
  }, []);

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

  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // Adjust to handle string IDs
  const handleEventClick = (eventId: string) => {
    setActiveEventId(eventId);
  };
  return (
    <div className="">
      {/* <select
        onChange={handleMonthChange}
        value={currentDate.getMonth().toString()}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <option key={index} value={index}>
            {new Date(0, index).toLocaleString("default", { month: "long" })}
          </option>
        ))}
      </select> */}
      <div className="-ml-4 -mr-4 relative ">
        <FullCalendar
          height={"100vh"}
          // contentHeight={"auto"}
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            left: "title",
            right: "today prev,next",
          }}
          events={allEvents as any}
          nowIndicator={true}
          selectable={true}
          dayMaxEventRows={3}
          selectMirror={true}
          eventContent={(eventInfo) => (
            <EventContent
              eventInfo={eventInfo}
              isActive={activeEventId === eventInfo.event.id.toString()}
              onEventClick={handleEventClick}
              setActiveEventId={setActiveEventId}
            />
          )}
        />
      </div>
    </div>
  );
};

export default CalendarPage;

interface EventContentProps {
  eventInfo: any;
  isActive: boolean;
  onEventClick: (id: string) => void;
  setActiveEventId: (id: string | null) => void;
}

const EventContent = ({
  eventInfo,
  isActive,
  onEventClick,
  setActiveEventId,
}: EventContentProps) => {
  const handleClick = () => {
    onEventClick(eventInfo.event.id.toString());
  };
  const handleCloseModal = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setActiveEventId(null);
  };

  return (
    <div className=" overflow-hidden" onClick={handleClick}>
      <div>
        <span className="text-xs ">{eventInfo.event.title}</span>
      </div>

      {isActive && (
        <ModalComponent eventInfo={eventInfo} onClose={handleCloseModal} />
      )}
    </div>
  );
};

interface ModalProps {
  eventInfo: any;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function ModalComponent({ eventInfo, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex shadow">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded ">
        <h1 className="text-black">{eventInfo.event.title}</h1>
        <button className="text-black" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

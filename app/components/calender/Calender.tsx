"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { TooltipComponent } from "@/app/components/tooltips/ToolTip";
import { Receipt } from "@/types/fetchReceipts";

interface Event {
  title: string;
  start: string | Date;
  end?: string | Date;
  id?: string | number;
}

interface CalenderProps {
  receipts: Receipt[];
}

const Calender = ({ receipts }: CalenderProps) => {
  const [allEvents, setAllEvents] = useState<Event[]>([
    { title: "", start: "", id: 0 },
  ]);

  useEffect(() => {
    const fetchEvents = () => {
      const events = [];

      for (const receipt of receipts) {
        const purchaseEvent = {
          title: `Purchased at ${receipt.store}`,
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
  }, [receipts]);

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

  const handleEventClick = (eventId: string) => {
    setActiveEventId(eventId);
  };
  return (
    <div className="">
      <div className="sm:-ml-2 sm:-mr-2 -ml-3 -mr-3 relative ">
        <FullCalendar
          height={"98vh"}
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

export default Calender;

interface EventContentProps {
  eventInfo: any;
  isActive: boolean;
  onEventClick: (id: string) => void;
  setActiveEventId: (id: string | null) => void;
}

const EventContent = ({ eventInfo, onEventClick }: EventContentProps) => {
  const handleClick = () => {
    onEventClick(eventInfo.event.id.toString());
  };
  const [tooltipPlacement, setTooltipPlacement] = useState("top");
  const eventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTooltipPlacement = () => {
      if (eventRef.current) {
        const { top, left, right } = eventRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let verticalPosition = "bottom";
        let horizontalPosition = "start";

        if (top < window.innerHeight / 2) {
          verticalPosition = "bottom";
        } else {
          verticalPosition = "top";
        }

        if ((left + right) / 2 < viewportWidth / 2) {
          horizontalPosition = "start";
        } else {
          horizontalPosition = "end";
        }

        setTooltipPlacement(`${verticalPosition}-${horizontalPosition}`);
      }
    };

    updateTooltipPlacement();
  }, []);

  return (
    <div
      className="overflow-hidden text-xs"
      onClick={handleClick}
      ref={eventRef}
    >
      <TooltipComponent
        placement={tooltipPlacement}
        item={eventInfo.event.title}
        content={eventInfo.event.title}
        date={eventInfo.event.start.toDateString()}
      />
    </div>
  );
};

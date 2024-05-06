"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./calender.module.css";
import { TooltipComponent } from "@/components/tooltips/ToolTip";
import { ReceiptType } from "@/types/ReceiptTypes";
import { useMediaQuery } from "react-responsive";
import { formatDateToMMDDYY } from "@/utils/Date";
import { getReceiptsClient } from "@/lib/getReceiptsClient";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import "moment-timezone";

interface Event {
  title: string;
  start: string | Date;
  end?: string | Date;
  id?: string | number;
}

interface CalenderProps {
  timezone: string;
}

const Calender = ({ timezone }: CalenderProps) => {
  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptType[]>([]);

  useEffect(() => {
    const fetchReceipt = async () => {
      const receipt = await getReceiptsClient();
      if (receipt) {
        const newReceipts = receipt as ReceiptType[];
        setReceipts(newReceipts);

        const filtered = newReceipts.filter((r) => {
          const currentDateInDetroit = moment.utc().tz(timezone).startOf("day");
          const returnDateUTC = moment.utc(r.return_date);

          return (
            returnDateUTC.isBefore(
              currentDateInDetroit.clone().add(7, "days")
            ) && returnDateUTC.isSameOrAfter(currentDateInDetroit, "day")
          );
        });

        setFilteredReceipts(filtered);
      }
      setIsLoading(false);
    };

    fetchReceipt();
  }, []);

  useEffect(() => {
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isMobileDeviceQuery]);

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

  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const handleEventClick = (eventId: string) => {
    setActiveEventId(eventId);
  };
  return (
    <div className="w-full flex flex-col gap-10 h-full max-w-[800px] items-center justify-center">
      <div className={styles.calendarContainer}>
        <div className={styles.fullcalendar}>
          <FullCalendar
            {...(isMobileDevice && { height: "100%" })}
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
      <div className="w-full flex flex-col gap-3">
        <div className="text-emerald-900 text-xl mb-4">Upcoming returns</div>
        {filteredReceipts &&
          filteredReceipts.length > 0 &&
          filteredReceipts.map((receipt) => (
            <div key={receipt.id} className="bg-white rounded-lg w-full p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm  text-orange-600">{receipt.store}</p>
                  <p className="text-sm text-slate-400">
                    {formatDateToMMDDYY(receipt.return_date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        {isLoading && (
          <div className="w-full flex items-center justify-center mt-10">
            <BeatLoader loading={isLoading} size={15} color={"rgb(6 78 59)"} />
          </div>
        )}
        {filteredReceipts.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg w-full p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm ">No upcoming receipts</p>
              </div>
            </div>
          </div>
        )}
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

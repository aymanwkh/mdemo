import FullCalendar, {
  CalendarOptions,
  EventClickArg,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  alpha,
  experimentalStyled as styled,
  useTheme,
} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import EventIcon from "@mui/icons-material/Event";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Event, eventColors } from "../utils/types";
import Header from "../components/Header";
import labels_a from '../utils/labels.json'
import labels_e from '../utils/labels_e.json'

const labels = process.env.REACT_APP_LANG === 'en' ? labels_e : labels_a

const StyledWrapper = styled("div")(
  ({ theme }) => `
  .fc-theme-standard .fc-scrollgrid {
    border-color: ${theme.palette.divider};
  }

  .fc th {
    border-right: none;
    border-left: none;
    padding: 10px 0;
  }

  .fc-theme-standard .fc-scrollgrid {
    border-right: none;
    border-left: none;
    border-bottom: none;
  }

  .fc-theme-standard td, .fc-theme-standard th {
    border-right: none;
  }

  .fc-theme-standard td, .fc-theme-standard th {
    border-color: ${theme.palette.divider};
  }

  .fc .fc-daygrid-day-number {
    color: ${theme.palette.text.secondary};
    font-size: 14px;
    font-weight: ${theme.typography.fontWeightBold};
    padding: 12px;
  }

  .fc .fc-daygrid-day.fc-day-today {
    background-color: ${alpha(theme.palette.primary.main, 0.1)};
  }
`
);

export default function Calendar() {
  const theme = useTheme();
  const events: Event[] = []
  const [viewTitle, setViewTitle] = useState("");
  const [calendarRef, setCalendarRef] = useState<FullCalendar | null>(null);

  const onEventClick = (event?: Event) => {

  }
  const onCalendarRefSet = useCallback((ref: any) => {
    if (ref !== null) {
      setCalendarRef(ref);
    }
  }, []);

  const handleEventClick = (arg: EventClickArg) => {
    if (onEventClick) {
      const event = events.find((e) => e.id === arg.event.id);
      onEventClick(event);
    }
  };

  const handleNext = () => {
    if (calendarRef) {
      calendarRef.getApi().next();
      setViewTitle(calendarRef.getApi().getCurrentData().viewTitle);
    }
  };

  const handlePrev = () => {
    if (calendarRef) {
      calendarRef.getApi().prev();
      setViewTitle(calendarRef.getApi().getCurrentData().viewTitle);
    }
  };

  const handleToday = () => {
    if (calendarRef) {
      calendarRef.getApi().today();
      setViewTitle(calendarRef.getApi().getCurrentData().viewTitle);
    }
  };

  useEffect(() => {
    if (calendarRef) {
      setViewTitle(calendarRef.getApi().getCurrentData().viewTitle);
    }
  }, [calendarRef]);

  const eventSource = useMemo(() => {
    return events.map((event: Event) => {
      if (event.color && eventColors.includes(event.color)) {
        return { ...event, color: theme.palette[event.color].main };
      }
      return event;
    });
  }, [events, theme]);

  return (
    <>
      <Header pageTitle="" />
      <Card>
        {/* Start - Custom Header Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
          }}
        >
          <Typography sx={{ display: "inline-flex" }} variant="h5">
            <EventIcon sx={{ mr: 2 }} />
            {viewTitle}
          </Typography>
          <Box>
            <IconButton
              aria-label="previous"
              component="span"
              onClick={handlePrev}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Button onClick={handleToday}>{labels.today}</Button>
            <IconButton
              aria-label="next"
              component="span"
              edge="end"
              onClick={handleNext}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
        {/* End - Custom Header Bar */}
        <StyledWrapper>
          <FullCalendar
            headerToolbar={false}
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={process.env.REACT_APP_LANG}
            ref={onCalendarRefSet}
            events={eventSource}
            eventClick={handleEventClick}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: false,
            }}
            contentHeight={720}
          />
        </StyledWrapper>
      </Card>
    </>
  );
};


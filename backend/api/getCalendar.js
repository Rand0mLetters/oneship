import fetch from "node-fetch";

const alternates = [
    {
        date: "20241008",
        schedule: [
            { name: "1st Period", start: "9:00", end: "9:50" },
            { name: "Brunch", start: "9:50", end: "10:05" },
            { name: "2nd Period", start: "10:05", end: "10:55" },
            { name: "3rd Period", start: "11:05", end: "11:55" },
            { name: "Lunch", start: "11:55", end: "12:25" },
            { name: "4th Period", start: "12:35", end: "1:25" },
            { name: "PRIME", start: "1:35", end: "2:25" },
        ],
    }, {
        date: "20241009",
        schedule: [
            { name: "PSAT (11)/SAT (12)", start: "8:30", end: "12:00" },
            { name: "Lunch", start: "12:00", end: "12:30" },
            { name: "5th Period", start: "12:40", end: "1:30" },
            { name: "6th Period", start: "1:40", end: "2:30" },
            { name: "7th Period", start: "2:40", end: "3:30" },
        ],
    },
]

const getCalendar = async () => {
    var response = await fetch("https://www.paly.net/data/calendar/icalcache/feed_480C4DDD5A484139AC879C9C72FE34B6.ics");
    // the response is an ical file, parse (relaibily)
    response = await response.text();
    
    var icalEvents = response.split("BEGIN:VEVENT");
    var events = [];
    for(var i = 1; i < icalEvents.length; i++){
        var event = icalEvents[i].replaceAll("\r", "").replaceAll("\\r", "").split("\n");
        var eventObj = {};
        for(var j = 0; j < event.length; j++){
            var line = event[j];
            var key = line.split(":")[0].toLowerCase();

            if(key == "") continue;
            if(key == "end") break;

            var value = line.slice(key.length + 1);

            if(key == "dtstart;value=date") key = "dtstart";
            if(key == "dtstart") key = "start";
            if(key == "dtend;value=date") key = "dtend";
            if(key == "dtend") key = "end";

            if(key == "description") value = value.replaceAll("\\n", "\n");
            eventObj[key] = value;
        }
        if(eventObj.end == undefined) eventObj.end = eventObj.start;
        events.push(eventObj);
    }
    return events;
}

const getScheduleForDay = (day, events) => {
    for(var i = 0; i < alternates.length; i++){
        var alternate = alternates[i];
        if(alternate.date == day){
            var schedule = [];
            for(var k in alternate.schedule){
                var period = alternate.schedule[k];
                var obj = {
                    startString: period.start,
                    start: calculateMinutesFromTime(period.start),
                    endString: period.end,
                    end: calculateMinutesFromTime(period.end),
                    name: period.name
                };
                if(obj.endString == "" || obj.startString == "" || obj.start == null || obj.end == null || obj.name == "") continue;
                schedule.push(obj);
            }
            return schedule;
        }
    }
    for(var i = 0; i < events.length; i++){
        var event = events[i];
        if(
            !event.summary.includes("Schedule") &&
            !event.summary.includes("Minimum Day") &&
            !event.summary.includes("Finals") &&
            !event.summary.includes("Schdule") &&
            /* ^ because pausd can't spell */
            /* it happened more than once */
            !event.summary.includes("Late Start Monday")
        ) continue;
        if(event.start.trim() == day.trim()){
            var periods = event.description.split("\n");
            var schedule = [];
            for(var k in periods){
                var spaceless = periods[k].replaceAll(" ", "");
                var startTime = spaceless.split("-")[0];
                var goofy = periods[k].replaceAll(startTime, "");
                goofy = goofy.replaceAll("-", "");
                goofy = goofy.trim();
                var endTime = goofy.split(" ")[0];
                var obj = {
                    startString: startTime.trim(),
                    start: calculateMinutesFromTime(startTime),
                    endString: endTime.trim(),
                    end: calculateMinutesFromTime(endTime),
                    name: goofy.replaceAll(endTime, "").replaceAll("period", "Period").trim(),
                    isFinal: event.summary.includes("Finals")
                };
                if(obj.endString == "" || obj.startString == "" || obj.start == null || obj.end == null || obj.name == "") continue;
                schedule.push(obj);
            }
            return schedule;
        }
    }
    return null;
}

const calculateMinutesFromTime = (timeString) => {
    var hour = parseInt(timeString.split(":")[0]);
    var time = (hour < 7 ? hour + 12 : hour) * 60
    time += parseInt(timeString.split(":")[1]);
    return time;
}

export {
    getScheduleForDay,
    getCalendar
}

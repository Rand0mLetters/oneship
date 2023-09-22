import fetch from "node-fetch";

const alternates = [
    {
        date: "20230901",
        schedule: [
            { name: "5th Period", start: "9:00", end: "10:15" },
            { name: "Brunch", start: "10:15", end: "10:30" },
            { name: "6th Period", start: "10:30", end: "11:45" },
            { name: "7th Period", start: "11:55", end: "1:10" },
        ],
    }
]

const getCalendar = async () => {
    var response = await fetch("https://www.paly.net/data/calendar/icalcache/feed_480C4DDD5A484139AC879C9C72FE34B6.ics");
    // the response is an ical file, parse (relaibily)
    response = await response.text();
    // console.log(response);
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
    // var events = await getCalendar();
    console.log(day);
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
            !event.summary.includes("Schdule")
            /* ^ because pausd can't spell */
            /* it happened more than once */
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
                    name: goofy.replaceAll(endTime, "").trim()
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

import { createContext, useContext } from "react";

class CustomScheduleItem{
    constructor(realName, customName, teacher, room){
        this.realName = realName;
        this.customName = customName ? customName : realName;
        this.teacher = teacher;
        this.room = room;
    }
}

const defaultSettings = {
    show0Period: false,
    schedule: {
        "0 Period": new CustomScheduleItem("0 Period", null, null, null),
        "1st Period": new CustomScheduleItem("1st Period", "Biology Honors", "Nicole Loomis", "1706"),
        "2nd Period": new CustomScheduleItem("2nd Period", null, null, null),
        "3rd Period": new CustomScheduleItem("3rd Period", null, null, null),
        "Lunch": new CustomScheduleItem("Lunch", null, null, null),
        "4th Period": new CustomScheduleItem("4th Period", "Geometry Honors", "Daniel Ngyuen", "810"),
        "5th Period": new CustomScheduleItem("5th Period", "Art Spectrum 1A", null, null),
        "6th Period": new CustomScheduleItem("6th Period", null, null, null),
        "Advisory": new CustomScheduleItem("Advisory", null, null, null),
        "PRIME": new CustomScheduleItem("PRIME", null, null, null),
        "7th Period": new CustomScheduleItem("7th Period", null, null, null),
    },
    isLightMode: true,
}

const RouteContext = createContext("");
const UserSettingsContext = createContext(defaultSettings)

export { UserSettingsContext, RouteContext, defaultSettings, CustomScheduleItem }
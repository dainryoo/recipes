const DAYS_OF_WEEK = {
    SUN: "Sun",
    MON: "Mon",
    TUE: "Tue",
    WED: "Wed",
    THU: "Thu",
    FRI: "Fri",
    SAT: "Sat",
};

const ORDER_TYPE = {
    DEFAULT: "Default",
    NO_WEEKEND: "No Weekend",
    TWO_WEEKS: "Two Weeks",
    FRI_FIRST: "Friday First",
    SAT_FIRST: "Saturday First",
    MON_FIRST: "Monday First"
};

const defaultWeekOrder = Object.values(DAYS_OF_WEEK);

const WEEK_ORDER = {
    [ORDER_TYPE.DEFAULT]: [ ...defaultWeekOrder ],
    [ORDER_TYPE.NO_WEEKEND]: [],
    [ORDER_TYPE.TWO_WEEKS]: [ ...defaultWeekOrder, ...defaultWeekOrder ],
    [ORDER_TYPE.FRI_FIRST]: [],
    [ORDER_TYPE.SAT_FIRST]: [],
    [ORDER_TYPE.MON_FIRST]: [],
};

const MEAL_PLAN_ENTRY = {
    DAY: "day",
    MEAL_TYPE: "meal-type"
}

module.exports = {
    DAYS_OF_WEEK,
    ORDER_TYPE,
    WEEK_ORDER,
    MEAL_PLAN_ENTRY
};
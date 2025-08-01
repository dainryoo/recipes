const DAYS_OF_WEEK = {
    SAT: "Sat",
    SUN: "Sun",
    MON: "Mon",
    TUE: "Tue",
    WED: "Wed",
    THU: "Thu",
    FRI: "Fri",
};

const ORDER_TYPE = {
    DEFAULT: "Default",
    NO_WEEKEND: "No Weekend",
    TWO_WEEKS: "Two Weeks",
    FRI_FIRST: "Friday First",
    SUN_FIRST: "Sunday First",
    MON_FIRST: "Monday First"
};

const defaultWeekOrder = Object.values(DAYS_OF_WEEK);

const WEEK_ORDER = {
    [ORDER_TYPE.DEFAULT]: [ ...defaultWeekOrder ],
    [ORDER_TYPE.NO_WEEKEND]: [],
    [ORDER_TYPE.TWO_WEEKS]: [ ...defaultWeekOrder, ...defaultWeekOrder ],
    [ORDER_TYPE.FRI_FIRST]: [],
    [ORDER_TYPE.SUN_FIRST]: [],
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
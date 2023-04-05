const { isPosInt, round } = require("./basicUtils");
const { DAYS_OF_WEEK, WEEK_ORDER, ORDER_TYPE } = require("../constants/calendar");

class Calendar {
  constructor(dayLength) {
    const defaultNumDays = WEEK_ORDER[ORDER_TYPE.DEFAULT].length;

    this.numDays = isPosInt(dayLength) ? round(dayLength) : defaultNumDays; // default number of days for the calendar is 7 if none is provided
    this.days = []; // array of strings, each string representing a day

    for (let i = 0; i < this.numDays; i++) {
      const dayOfWeekIndex = i <= 6 ? i : i%defaultNumDays;
      this.days.push(WEEK_ORDER[ORDER_TYPE.DEFAULT][dayOfWeekIndex]);
    }
  }

  // Set the entire Calendar object with the passed in days array
  setCalendar(newDays) {
    if (newDays?.length > 0) {
      this.numDays = newDays.length;

      this.days = [ ...newDays ];
    }
  }

  getNumDays() {
    return this.numDays;
  }

  getDays() {
    return this.days;
  }

  // Return all the days of this calendar in order, as a single string
  getDaysString() {
    return this.days.join("\t");
  }
}

module.exports = {
  Calendar
};
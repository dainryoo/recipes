const { DAYS_OF_WEEK, WEEK_ORDER, ORDER_TYPE } = require("../data/constants/calendar");
const { Calendar } = require("../data/utils/calendarUtils");

test('Calendar class constructor should set up correct array of days', () => {
    const defaultNumDays = 7;

    const cal1 = new Calendar();
    expect(cal1.getNumDays()).toEqual(defaultNumDays);
    
    const cal2 = new Calendar(7);
    expect(cal2.getNumDays()).toEqual(7);

    const cal3 = new Calendar(6);
    expect(cal3.getNumDays()).toEqual(6);

    const cal4 = new Calendar(0);
    expect(cal4.getNumDays()).toEqual(defaultNumDays);

    const cal5 = new Calendar(-1);
    expect(cal5.getNumDays()).toEqual(defaultNumDays);

    const cal6 = new Calendar(null);
    expect(cal6.getNumDays()).toEqual(defaultNumDays);

    const cal7 = new Calendar(1.5);
    expect(cal7.getNumDays()).toEqual(2);
});

test('Calendar class constructor should set up the correct order of days of the week', () => {
    const cal1 = new Calendar();
    expect(cal1.getDays()).toEqual([ ...WEEK_ORDER[ORDER_TYPE.DEFAULT] ]);

    const cal2 = new Calendar(1);
    expect(cal2.getDays()).toEqual([ DAYS_OF_WEEK.SUN ]);

    const cal3 = new Calendar(14);
    expect(cal3.getDays()).toEqual([ ...WEEK_ORDER[ORDER_TYPE.DEFAULT], ...WEEK_ORDER[ORDER_TYPE.DEFAULT] ]);

    const cal4 = new Calendar(8);
    expect(cal4.getDays()).toEqual([ ...WEEK_ORDER[ORDER_TYPE.DEFAULT], DAYS_OF_WEEK.SUN ]);
});

test('Calendar class should be able to return a string of the days in order', () => {
    const cal1 = new Calendar();
    expect(cal1.getDaysString()).toEqual([ ...WEEK_ORDER[ORDER_TYPE.DEFAULT] ].join("\t"));

    const cal2 = new Calendar(-1);
    expect(cal2.getDaysString()).toEqual([ ...WEEK_ORDER[ORDER_TYPE.DEFAULT] ].join("\t"));

    const cal3 = new Calendar(1);
    expect(cal3.getDaysString()).toEqual(DAYS_OF_WEEK.SUN);
})
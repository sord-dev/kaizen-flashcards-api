const StreakCounter = require('../lib/streakCounter.js');

describe('Streak Counter Functionality', () => {
    it('Should have the streak at 1 and have today as the start date', () => {
        let today = new Date();
        const streak = new StreakCounter({startDate: today});

        expect(streak.startDate.day()).toBe(today.getDay())
    });

    it('Should increase streak count and change the last hit to today', () => {
        let today = new Date();
        const streak = new StreakCounter({startDate: today});

        streak.incriment()

        expect(streak.count).toBe(2);
        expect(streak.lastHit.day()).toBe(today.getDay())
    });

    it('Should reset streak and change last hit to today', () => {
        let today = new Date();
        const streak = new StreakCounter({ startDate: today });
        streak.count = 5;

        streak.reset()

        expect(streak.count).toBe(1);
        expect(streak.startDate.day()).toBe(today.getDay());
        expect(streak.lastHit.day()).toBe(today.getDay());
    });

    it('Should detect valid streak', () => {
        let streak = new StreakCounter({ lastHit: new Date('2023-04-21'), startDate: new Date(), count: 1 }); // smth strange happens with this test, i'm not sure what

        expect(streak.shouldUpdate()).toBe(true);
        expect(streak.shouldReset()).toBe(false);
    });

    it('Should detect invalid streak', () => {
        let notValidDate = new Date('05-03-2023');
        const streak = new StreakCounter({lastHit: notValidDate});

        expect(streak.shouldReset()).toBe(true);
        expect(streak.shouldUpdate()).toBe(false);
    });
})
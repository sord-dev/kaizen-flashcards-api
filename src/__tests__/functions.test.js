const StreakCounter = require('../lib/streakCounter.js');

describe('Streak Counter Functionality', () => {
    it('Should have the streak at 1 and have today as the start date', () => {
        let today = new Date();
        const streak = new StreakCounter(today);

        expect(streak.startDate.day()).toBe(today.getDay())
    });

    it('Should increase streak count and change the last hit to today', () => {
        let today = new Date();
        const streak = new StreakCounter(today);

        streak.incriment()

        expect(streak.count).toBe(2);
        expect(streak.lastHit.day()).toBe(today.getDay())
    });

    it('Should reset streak and change last hit to today', () => {
        let today = new Date();
        const streak = new StreakCounter(today);
        streak.count = 5;

        streak.reset()

        expect(streak.count).toBe(1);
        expect(streak.startDate.day()).toBe(today.getDay());
        expect(streak.lastHit.day()).toBe(today.getDay());
    });

    it('Should detect valid streak', () => {
        let today = new Date();
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const streak = new StreakCounter(yesterday);

        expect(StreakCounter.shouldUpdate(streak)).toBe(true);
        expect(StreakCounter.shouldReset(streak)).toBe(false);
    });

    it('Should detect invalid streak', () => {
        let notValidDate = new Date('05-03-2023');
        const streak = new StreakCounter(notValidDate);

        expect(StreakCounter.shouldReset(streak)).toBe(true);
        expect(StreakCounter.shouldUpdate(streak)).toBe(false);
    });
})
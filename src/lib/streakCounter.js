const dayjs = require('dayjs')

class StreakCounter {
    constructor({ startDate, count, lastHit }) {
        this.startDate = dayjs(startDate) || dayjs();
        this.count = count || 1;
        this.lastHit = dayjs(lastHit) || dayjs(new Date());
    }

    shouldUpdate() {
        let today = dayjs();
        
        let difference = today.diff(this.lastHit, 'day');

        console.log('diff, ', difference);
        return difference === 1;
    }

    shouldReset() {
        let today = dayjs();

        let difference = this.lastHit.diff(today, 'day');

        if (difference == 0) return false;
        return difference != 1;
    }

    incriment() {
        this.count++
        this.lastHit = dayjs();
    }

    reset() {
        this.count = 1
        this.startDate = dayjs();
        this.lastHit = dayjs();
    }
}

module.exports = StreakCounter;

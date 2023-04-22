const dayjs = require('dayjs')

class StreakCounter {
    constructor(startDate) {
        this.startDate = dayjs(startDate);
        this.count = 1;
        this.lastHit = dayjs(new Date());
    }
    
    static shouldUpdate(streakCounter) {
        let startDate = dayjs(streakCounter.startDate)
        let lastHit = dayjs(streakCounter.lastHit);
        
        let difference = lastHit.diff(startDate, 'day');

        return difference === 1; 
    }

    static shouldReset(streakCounter) {
        let startDate = dayjs(streakCounter.startDate)
        let lastHit = dayjs(streakCounter.lastHit);
        
        let difference = lastHit.diff(startDate, 'day');

        if(difference == 0) return false;
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

const User = require('../models/user.js')
const StreakCounter = require('../lib/streakCounter.js')

module.exports.login = async (req, res) => {
    let { body } = req;

    try {
        const user = await User.findByUsername(body.username);
        const validPw = await User.comparePassword(body.password, user.password);

        if (validPw) {
            let streak = new StreakCounter(user.streak);
            // check user streak status
            if (streak.shouldUpdate()) { // if streak should update, incriment streak
                streak.incriment(); 
                const userdat = await user.updateStreak(streak) // update that data in the user
                return res.status(200).json({ ...userdat, password: null }) // return user data back to client
            }

            else if (streak.shouldReset()) { // if streak should reset, reset streak
                streak.reset();
                const userdat = await user.updateStreak(streak)

                return res.status(200).json({ ...userdat, password: null }) // return user data back to client
            }
            else { // if user is signing in on the same day
                return res.status(200).json({ ...user, password: null, streak }) // send back user details and streak 
            }
        } else {
            throw new Error('Incorrect Password')
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message })
    }
}

module.exports.register = async (req, res) => {
    const { body } = req;
    try {
        const usr = new User({ username: body.username, password: body.password });

        // hash user password and save
        let hashed = await User.hashPassword(usr.password);
        usr.password = hashed;

        // create and assign user streak
        const userStreak = new StreakCounter({ startDate: new Date() });
        usr.streak = userStreak;
        await usr.save();

        const user = await User.findByUsername(body.username)

        res.status(201).json({ ...user, password: null });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports.index = async (req, res) => {
    try {
        const resp = await User.getAll();
        res.json(resp);
    }
    catch (e) {
        res.json({ message: e.message })
    }
}

module.exports.addStats = async (req, res) => {
    try {
        const user_id = parseInt(req.body.user_id);
        const user = await User.findById(user_id);

        const resp = await user.updateStats(req.body.amount, req.body.correct)
        res.json(resp).status(200)
    }
    catch (e) {
        res.json({ message: e.message }).status(404)
    }
}

module.exports.getUserStats = async (req, res) => {
    try {
        const resp = await User.getUserStats(parseInt(req.params.user_id))
        res.json(resp.rows[0]).status(200)
    }
    catch (e) {
        console.log(e);
        res.status(404).json({ message: e.message })
    }
}
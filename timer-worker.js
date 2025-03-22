let timerStartTime = null;
let timerDuration = 5; // Default duration in minutes
let timeLeft = timerDuration * 60;

self.onmessage = function (e) {
    switch (e.data.type) {
        case 'START_TIMER':
            timerStartTime = Date.now();
            timerDuration = e.data.duration;
            timeLeft = timerDuration * 60;
            updateTimer();
            break;
        case 'STOP_TIMER':
            timerStartTime = null;
            break;
        case 'UPDATE_DURATION':
            timerDuration = e.data.duration;
            timeLeft = timerDuration * 60;
            break;
    }
};

function updateTimer() {
    if (!timerStartTime) {
        self.postMessage({
            type: 'TIMER_UPDATE',
            timeLeft: timeLeft,
            isRunning: false
        });
        return;
    }

    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - timerStartTime) / 1000);
    timeLeft = Math.max(0, (timerDuration * 60) - elapsedTime);

    self.postMessage({
        type: 'TIMER_UPDATE',
        timeLeft: timeLeft,
        isRunning: true
    });

    if (timeLeft > 0) {
        setTimeout(updateTimer, 1000);
    } else {
        self.postMessage({
            type: 'TIMER_COMPLETE'
        });
    }
} 
let timerStartTime = null;
let timerDuration = 5; // Default duration in minutes
let timeLeft = timerDuration * 60;
let timerInterval = null;

self.onmessage = function (e) {
    switch (e.data.type) {
        case 'START_TIMER':
            timerDuration = e.data.duration;
            timeLeft = timerDuration * 60;
            timerStartTime = Date.now();
            startTimer();
            break;
        case 'STOP_TIMER':
            stopTimer();
            break;
        case 'UPDATE_DURATION':
            timerDuration = e.data.duration;
            timeLeft = timerDuration * 60;
            if (timerInterval) {
                stopTimer();
                startTimer();
            }
            break;
    }
};

function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
        timeLeft = Math.max(0, (timerDuration * 60) - elapsed);

        self.postMessage({
            type: 'TIMER_UPDATE',
            timeLeft: timeLeft
        });

        if (timeLeft <= 0) {
            stopTimer();
            self.postMessage({
                type: 'TIMER_COMPLETE'
            });
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
} 
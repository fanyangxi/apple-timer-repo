# apple-timer-repo
Yet another timer (Apple Timer)

### Concepts:
Preset:
- prepare: in Sec
- work: in Sec
- rest: in Sec
- cycles count: int,
- sets-divider: in Sec
- sets-count:

Secs: short for seconds.

Cycle:

Set: has multiple cycles.

Preset: has multiple sets.

### Home Screen:

//// Top-Bar Section:
Change App-Settings Button:
Toggle Mute Button:

//// Timer Section:
@summary-section:
? change-current-preset-button:
? time-renaming:
? total-time:

@details-section (Normal state):
current preset:
    - prepare: in Sec
    - workout: in Sec
    - rest: in Sec
    - cycles-count: int,
    - sets-count:
In-timer-phase state (Prepare|Workout|Rest)
    - phase-name
    - time-left-in-phase 
    
@action-section:
start-workout-button:


svgr --replace-attr-values "#fff=currentColor" icon.svg -d ./

https://stackoverflow.com/questions/21277900/how-can-i-pause-setinterval-functions
https://github.com/mathiasvr/tiny-timer/blob/master/src/tiny-timer.ts
https://npm.io/package/tiny-timer
https://github.com/fanatid/elapsed-time

https://npm.io/search/keyword:stopwatch
+
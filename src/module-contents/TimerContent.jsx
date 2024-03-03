import { useState, useEffect, useRef } from "react"

import '../css/css-module-content/TimerContent.css'

export default function TimerContent(props) {
    // time is seconds, intervals are minutes
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [timeInput, setTimeInput] = useState(10);
    const [pomoWorkInput, setPomoWorkInput] = useState(45)
    const [pomoRestInput, setPomoRestInput] = useState(15)
    const [targetInterval, setTargetInterval] = useState(timeInput);

    if (localData === undefined) {
        setLocalData(() => ({ timerActive: true, time: 0, interval: 10, pomodoro: { on: false, workMode: true, workInterval: 45, restInterval: 15 } }));
    }

    function timerZero() {
        setLocalData((prev) => ({ ...prev, time: 0 }))
    }

    // autosave
    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    // timer
    useEffect(() => {
        const timer = setInterval(() => {
            console.log(props.counter, " interval", targetInterval);
            if (localData.pomodoro.on) {
                setTargetInterval(() => localData.pomodoro.workMode ? localData.pomodoro.workInterval : localData.pomodoro.restInterval)
                // if timer is done swap pomodoro modes
                if (localData.time >= targetInterval * 60) {
                    timerZero();
                    if (localData.pomodoro.workMode) {
                        setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, workMode: false } }));
                        setTargetInterval(() => localData.pomodoro.restInterval);
                    } else {
                        setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, workMode: true } }));
                        setTargetInterval(() => localData.pomodoro.workInterval);
                    }
                }
            }
            // if not pomodoro
            else {
                setTargetInterval(() => localData.interval);
            }

            if (localData.timerActive) {
                if (localData.time < targetInterval * 60) {
                    console.log(localData.time < targetInterval * 60, localData.time, targetInterval * 60)
                    setLocalData((prev) => ({ ...prev, time: prev.time + 1 }))
                }

                if (localData.time >= targetInterval * 60) {
                    console.log("TIMER DONE")
                }
            }
            else {
                console.log("paused");
            }

        }, 1000);

        return () => clearInterval(timer);
    }, [localData])


    function IntervalControl() {
        return (
            <div id="interval-set">
                <span><label htmlFor="timerNumInp">Time (m):</label></span>
                <input className="Px40W" id="timerNumInp" type="number" value={timeInput} onChange={e => setTimeInput(e.target.value)} />
                <button onClick={(e) => setLocalData((prev) => ({ ...prev, interval: Number(timeInput) }))}> Set</button>
            </div >
        )
    }

    function PomodoroIntervalControl() {
        return (
            <>
                <div id="work-interval-set">
                    <span><label htmlFor="timerNumInp">Work Time (m):</label></span>
                    <input className="Px40W" id="timerNumInp" type="number" value={pomoWorkInput} onChange={e => setPomoWorkInput(e.target.value)} />
                    <button onClick={(e) => setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, workInterval: Number(pomoWorkInput) } }))}> Set</button>
                </div>
                <div id="rest-interval-set">
                    <span><label htmlFor="timerNumInp">Rest Time (m):</label></span>
                    <input className="Px40W" id="timerNumInp" type="number" value={pomoRestInput} onChange={e => setPomoRestInput(e.target.value)} />
                    <button onClick={(e) => setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, restInterval: Number(pomoRestInput) } }))}> Set</button>
                </div>
            </>
        )
    }

    if (localData) {
        const percentComplete = (localData.time / (targetInterval * 60)) * 100;
        return (
            <section className="timer-content">
                <div className="timer-bar" style={{ width: `${(localData.time / (targetInterval * 60)) * 100}%` }}>
                    <p>{localData.time} / {targetInterval * 60} ({percentComplete.toFixed(2)}%) {!localData.pomodoro.on ? "Regular" : localData.pomodoro.workMode ? "Work - pomodoro" : "Rest - pomodoro"}</p>
                </div>
                <p>{localData.time >= targetInterval * 60 ? "Time reached" : "Not yet"}</p>
                <p>Percent complete: {percentComplete.toFixed(2)}%</p>
                <p>{localData.time}</p>
                <p>{JSON.stringify(localData)}</p>

                <span><label htmlFor="pomodoroCheckbox">Pomodoro mode?</label><input id="pomodoroCheckbox" type="checkbox" onChange={(e) => setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, on: !localData.pomodoro.on } }))} /></span>

                {localData.pomodoro.on ? <PomodoroIntervalControl /> : <IntervalControl />}

                <div>
                    <button onClick={() => setLocalData((prev) => ({ ...prev, timerActive: true }))} > Resume </button>
                    <button onClick={() => setLocalData((prev) => ({ ...prev, timerActive: false }))} > Pause </button>
                </div>

            </section >
        )
    }
}
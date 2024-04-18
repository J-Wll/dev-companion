import { useState, useEffect, useRef } from "react"

import '../css/css-module-content/TimerContent.css'

export default function TimerContent(props) {
    // time is seconds, intervals are minutes
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [timeInput, setTimeInput] = useState(10);
    const [pomoWorkInput, setPomoWorkInput] = useState(45)
    const [pomoRestInput, setPomoRestInput] = useState(15)
    const [targetInterval, setTargetInterval] = useState(timeInput);
    const labelRef = useRef();

    // default values if no global data
    useEffect(() => {
        if (!localData || !localData.time) {
            setLocalData(() => ({ timerActive: true, time: 0, interval: 10, notifies: false, repeats: false, pomodoro: { on: false, workMode: true, workInterval: 45, restInterval: 15 } }));
        }
    }, [])

    // autosave
    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])


    function timerMode(swap) {
        if (localData.pomodoro.on) {
            setTargetInterval(() => localData.pomodoro.workMode ? localData.pomodoro.workInterval : localData.pomodoro.restInterval)
            // if timer is done swap pomodoro modes
            if (localData.time >= targetInterval * 60 || swap) {
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
    }

    function timerZero() {
        setLocalData((prev) => ({ ...prev, alreadyNotified: false }));
        setLocalData((prev) => ({ ...prev, time: 0 }))
    }

    // TIMER
    useEffect(() => {
        const timer = setInterval(() => {
            // console.log(props.counter, " interval", targetInterval);

            timerMode();

            if (localData.timerActive) {
                if (localData.time < targetInterval * 60) {
                    // console.log(localData.time < targetInterval * 60, localData.time, targetInterval * 60)
                    setLocalData((prev) => ({ ...prev, time: prev.time + 1 }))
                }

                if ((localData.time === targetInterval * 60) && localData.notifies && !localData.alreadyNotified) {
                    let pMsg = "";
                    if (localData.pomodoro.on) {
                        pMsg = ` ${localData.pomodoro.workMode ? "Rest" : "Work"} mode starting`;
                    }
                    alert(`Timer -${labelRef.current.value} complete.${pMsg}`);
                    setLocalData((prev => ({ ...prev, alreadyNotified: true })));
                }

                if (localData.time >= targetInterval * 60) {
                    if (localData.repeats && !localData.pomodoro.on) {
                        timerZero();
                    }
                }
            }

            timerMode();

        }, 1000);

        return () => clearInterval(timer);
    }, [localData])


    if (localData) {
        // console.log(targetInterval, localData.interval);
        let currentInterval;
        let intervalControl, pomodoroIntervalControl;

        if (!localData.pomodoro.on) {
            intervalControl =
                <>
                    <div><label htmlFor="repeatsCheckbox">Timer repeats?</label><input id="repeatsCheckbox" type="checkbox" defaultChecked={localData.repeats} onChange={(e) => { setLocalData((prev) => ({ ...prev, repeats: !localData.repeats })) }} /></div>
                    <div id="interval-set">
                        <span><label htmlFor="timerNumInp">Time (m):</label></span>
                        <input className="Px40W" id="timerNumInp" type="number" value={timeInput} onChange={e => setTimeInput(e.target.value)} />
                        <button onClick={(e) => { timerZero(); timerMode(); setLocalData((prev) => ({ ...prev, interval: Number(timeInput) })) }}> Set</button>
                    </div >
                </>
        }
        if (localData.pomodoro.on) {
            if (localData.pomodoro.workMode) {
                currentInterval = localData.pomodoro.workInterval;
            }
            else {
                currentInterval = localData.pomodoro.restInterval;
            }
            pomodoroIntervalControl =
                <>
                    <div>
                        <button onClick={(e) => { timerMode(true); }}>{`Swap to ${localData.pomodoro.workMode ? "Rest" : "Work"} mode`}</button>
                    </div>
                    <div id="work-interval-set">
                        <span><label htmlFor="timerNumInp">Work Time (m):</label></span>
                        <input className="Px40W" id="timerNumInp" type="number" value={pomoWorkInput} onChange={e => setPomoWorkInput(e.target.value)} />
                        <button onClick={(e) => { timerZero(); timerMode(); setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, workInterval: Number(pomoWorkInput) } })) }}> Set</button>
                    </div>
                    <div id="rest-interval-set">
                        <span><label htmlFor="timerNumInp">Rest Time (m):</label></span>
                        <input className="Px40W" id="timerNumInp" type="number" value={pomoRestInput} onChange={e => setPomoRestInput(e.target.value)} />
                        <button onClick={(e) => { timerZero(); timerMode(); setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, restInterval: Number(pomoRestInput) } })) }}> Set</button>
                    </div>
                </>
        }
        else {
            currentInterval = localData.interval;
        }

        const percentComplete = (localData.time / (currentInterval * 60)) * 100;
        return (
            <section className="timer-content">
                <div className="timer-bar" style={{ width: `${(localData.time / (currentInterval * 60)) * 100}%` }}>
                    <p>{localData.time} / {currentInterval * 60} ({percentComplete.toFixed(2)}%) {!localData.pomodoro.on ? "Regular" : localData.pomodoro.workMode ? "Work - pomodoro" : "Rest - pomodoro"}</p>
                </div>

                <div><input type="text" placeholder="Label" ref={labelRef} className="timer-label" onChange={(v) => { setLocalData((prev) => ({ ...prev, label: v.target.value })) }} /></div>

                <div><label htmlFor="pomodoroCheckbox">Pomodoro mode?</label><input id="pomodoroCheckbox" type="checkbox" defaultChecked={localData.pomodoro.on} onChange={(e) => { timerZero(); timerMode(); setLocalData((prev) => ({ ...prev, pomodoro: { ...localData.pomodoro, on: !localData.pomodoro.on } })) }} /></div>
                <div><label htmlFor="notifyCheckbox">Notify on completion?</label><input id="notifyCheckbox" type="checkbox" defaultChecked={localData.notifies} onChange={(e) => { setLocalData((prev) => ({ ...prev, notifies: !localData.notifies })) }} /></div>

                {localData.pomodoro.on ? pomodoroIntervalControl : intervalControl}

                <div>
                    <button onClick={() => setLocalData((prev) => ({ ...prev, timerActive: true }))} > Resume </button>
                    <button onClick={() => setLocalData((prev) => ({ ...prev, timerActive: false }))} > Pause </button>
                </div>
            </section >
        )
    }
}
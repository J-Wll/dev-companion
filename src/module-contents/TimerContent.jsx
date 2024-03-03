import { useState, useEffect, useRef } from "react"

import '../css/css-module-content/TimerContent.css'

export default function TimerContent(props) {
    // time is seconds, intervals are minutes
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [timeInput, setTimeInput] = useState(1);

    if (localData === undefined) {
        setLocalData(() => ({ timerActive: true, time: 0, interval: 1, pomodoro: { on: false, workInterval: 45, restInterval: 15 } }));
    }

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    useEffect(() => {
        const timer = setInterval(() => {
            console.log(props.counter, " interval");
            if (localData.timerActive) {
                if (localData.time < localData.interval * 60) {
                    console.log(localData.time < localData.interval * 60, localData.time, localData.interval * 60)
                    setLocalData((prev) => ({ ...prev, time: prev.time + 1 }))
                }

                if (localData.time >= localData.interval * 60) {
                    console.log("TIMER DONE")
                }
            }
            else {
                console.log("paused");
            }

        }, 1000);

        return () => clearInterval(timer);
    }, [localData])

    function setTimerInterval(e, i) {
        console.log(i);
        setLocalData(prev => ({ ...prev, interval: Number(i) }));
    }

    if (localData) {
        const percentComplete = (localData.time / (localData.interval * 60)) * 100;
        return (
            <section className="timer-content">
                <div style={{ height: "30px", width: `${(localData.time / (localData.interval * 60)) * 100}%`, backgroundColor: "red" }}></div>
                <p>{localData.time >= localData.interval * 60 ? "Time reached" : "Not yet"}</p>
                <p>Percent complete: {percentComplete.toFixed(2)}%</p>
                <p>{localData.time}</p>
                <p>{JSON.stringify(localData)}</p>

                <div id="interval-set">
                    <span><label htmlFor="timerNumInp">Time (m):</label></span>
                    <input id="timerNumInp" type="number" value={timeInput} onChange={e => setTimeInput(e.target.value)} />
                    <button onClick={(e) => setTimerInterval(e, timeInput)}> Set</button>
                </div>

                <div>
                    <button onClick={() => setLocalData((prev) => ({ ...prev, timerActive: true }))} > Resume </button>
                    <button onClick={() => setLocalData((prev) => ({ ...prev, timerActive: false }))}>Pause</button>
                </div>

            </section >
        )
    }
}
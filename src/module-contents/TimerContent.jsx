import { useState, useEffect } from "react"

import '../css/css-module-content/TimerContent.css'

export default function TimerContent(props) {
    // time is seconds, intervals are minutes
    const [localData, setLocalData] = useState(props.dataFromGlobal);

    if (localData === undefined) {
        setLocalData(() => ({ time: 0, pomodoro: { on: false, workInterval: 45, restInterval: 15 }, interval: 1 }));
    }

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    useEffect(() => {
        const timer = setInterval(() => {
            console.log(props.counter, " interval");
            if (localData.time < localData.interval * 60) {
                console.log(localData.time < localData.interval * 60, localData.time, localData.interval * 60)
                setLocalData((prev) => ({ ...prev, time: prev.time + 1 }))
            }

            if (localData.time >= localData.interval * 60) {
                console.log("TIMER DONE")
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [localData])

    if (localData) {
        const percentComplete = (localData.time / (localData.interval * 60)) * 100;
        return (
            <section div="timer-content">
                <div style={{ height: "30px", width: `${(localData.time / (localData.interval * 60)) * 100}%`, backgroundColor: "red" }}></div>
                <p>{localData.time >= localData.interval * 60 ? "Time reached" : "Not yet"}</p>
                <p>Percent complete: {percentComplete.toFixed(2)}%</p>
                <p>{localData.time}</p>
                <p>{JSON.stringify(localData)}</p>
            </section>
        )
    }
}

import { useState, useEffect } from "react"

import '../css/css-module-content/TimerContent.css'

export default function TimerContent(props) {
    // time is seconds, intervals are minutes
    const [localData, setLocalData] = useState(props.dataFromGlobal);

    if (localData === undefined) {
        setLocalData({ time: 0, pomodoro: { on: false, workInterval: 45, restInterval: 15 }, interval: 10 });
    }

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    useEffect(() => {
        const timer = setInterval(() => {
            console.log(props.counter, " interval");
            setLocalData((prev) => ({ ...prev, time: prev.time + 1 }))
            if (localData.time === localData.interval * 60) {
                console.log("TIMER DONE")
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [])

    return (
        <section>
            <p>{JSON.stringify(localData)}</p>
        </section>
    )
}
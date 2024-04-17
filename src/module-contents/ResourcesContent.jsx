import { useState, useEffect } from "react";

import "../css/css-module-content/ResourcesContent.css"

export default function ResourcesContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [refresh, triggerRefresh] = useState(false);

    console.log(localData)

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    return (
        <></>
    )
}
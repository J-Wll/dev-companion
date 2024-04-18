import { useState, useEffect, useRef } from "react";

import "../css/css-module-content/ResourcesContent.css"
import defaultResources from "../assets/Default Resources.json";

// Minimse this, importing it from the file caused issues with effecting other resource modules
// const defaultResources = {
//     "General": [
//         {
//             "name": "Stack Overflow",
//             "description": "A popular Q&A platform for programmers",
//             "link": "https://stackoverflow.com/"
//         },
//         {
//             "name": "GitHub",
//             "description": "A platform for hosting and collaborating on code repositories",
//             "link": "https://github.com/"
//         },
//         {
//             "name": "DevDocs",
//             "description": "Information on over 600 languages/frameworks",
//             "link": "https://devdocs.io"
//         },
//         {
//             "name": "LeetCode",
//             "description": "A leading online platform for interview preparation and learning data structures and algorithms",
//             "link": "https://leetcode.com/"
//         },
//         {
//             "name": "HackerRank",
//             "description": "Practice coding, prepare for interviews, and compete in challenges",
//             "link": "https://www.hackerrank.com/"
//         },
//         {
//             "name": "Regex101",
//             "description": "Online regular expression tester and debugger with syntax highlighting and explanations",
//             "link": "https://regex101.com/"
//         },
//         {
//             "name": "Repl.it",
//             "description": "An online IDE for programming in various languages, with collaborative features",
//             "link": "https://replit.com/"
//         },
//         {
//             "name": "Godbolt",
//             "description": "Interactive tool for exploring the output of compiler optimization on code snippets",
//             "link": "https://godbolt.org/"
//         }
//     ],
//     "Learning": [
//         {
//             "name": "FreeCodeCamp",
//             "description": "A comprehensive platform for learning web development",
//             "link": "https://www.freecodecamp.org/"
//         },
//         {
//             "name": "Coursera",
//             "description": "Offers a wide range of online courses, including programming",
//             "link": "https://www.coursera.org/"
//         },
//         {
//             "name": "KhanAcademy",
//             "description": "Good for learning the basics of computing and programming",
//             "link": "https://www.khanacademy.org/computing"
//         }
//     ],
//     "HTML": [
//         {
//             "name": "allthetags",
//             "description": "A website that shows every HTML tag",
//             "link": "https://allthetags.com"
//         },
//         {
//             "name": "w3schools",
//             "description": "A useful resource for the basics of HTML",
//             "link": "https://www.w3schools.com/html/"
//         }
//     ],
//     "CSS": [
//         {
//             "name": "MDN Web Docs - CSS",
//             "description": "Mozilla's documentation on CSS properties and usage",
//             "link": "https://developer.mozilla.org/en-US/docs/Web/CSS"
//         },
//         {
//             "name": "CSS Tricks",
//             "description": "A blog with tips, tricks, and tutorials related to CSS",
//             "link": "https://css-tricks.com/"
//         },
//         {
//             "name": "w3schools",
//             "description": "A useful resource for the basics of CSS",
//             "link": "https://www.w3schools.com/css/"
//         }
//     ],
//     "JavaScript": [
//         {
//             "name": "MDN Web Docs - JavaScript",
//             "description": "Mozilla's comprehensive JavaScript documentation",
//             "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
//         },
//         {
//             "name": "Eloquent JavaScript",
//             "description": "An online book for learning JavaScript",
//             "link": "https://eloquentjavascript.net/"
//         },
//         {
//             "name": "w3schools",
//             "description": "A useful resource for the basics of JavaScript",
//             "link": "https://www.w3schools.com/js/"
//         }
//     ],
//     "React": [
//         {
//             "name": "React Official Documentation",
//             "description": "The official documentation for React",
//             "link": "https://react.dev/reference/react"
//         },
//         {
//             "name": "React for Beginners",
//             "description": "A beginner-friendly course on React",
//             "link": "https://reactforbeginners.com/"
//         },
//         {
//             "name": "w3schools",
//             "description": "A useful resource for the basics of React",
//             "link": "https://www.w3schools.com/react/"
//         }
//     ]
// }


import { ContentEditableDiv } from "../small-components/ContentEditableDiv";

function Resources(props) {
    console.log(props.data.data[props.selected]);

    try {
        const returnVal = props.data.data[props.selected].map((item, index) =>
            <li key={index}><a href="#" onClick={() => window.electron.openLink(item.link)}>{item.name}</a> - {item.description} <button onClick={() => { props.deleteResource(item.name) }} className="delete-resource">X</button></li>
        )
        return (
            <ul>
                {returnVal}
            </ul>
        )
    }
    catch (error) {
        console.log(error);
    }
}


function ResourceInput(props) {
    const [nameInp, setNameInp] = useState("");
    const [linkInp, setLinkInp] = useState("");
    const [descriptionInp, setDescriptionInp] = useState("");

    function addData() {
        let newld = props.localData;
        if (props.inpType === "item") {
            newld.data[props.localData.selected].push({ name: nameInp, link: linkInp, description: descriptionInp });
        }
        else if (props.inpType === "category") {
            newld.data[nameInp] = [];
            newld.selected = nameInp;
        }
        props.setLocalData(newld);
        props.triggerRefresh();
    }

    let extraFields = <></>;
    if (props.inpType === "item") {
        extraFields =
            <>
                <ContentEditableDiv class="resource-field-inp" Placeholder="Full link" value={linkInp} onChange={(v) => setLinkInp(v)} />
                <ContentEditableDiv class="resource-field-inp" Placeholder="Description" value={descriptionInp} onChange={(v) => setDescriptionInp(v)} />
            </>
    }
    return (
        <>
            <ContentEditableDiv class="resource-field-inp" Placeholder="Name" value={nameInp} onChange={(v) => setNameInp(v)} />
            {extraFields}

            <div>
                <button onClick={addData}>Add</button>
                <button onClick={() => props.toggleCategory(false)}>Close</button>
            </div>
        </>
    )
}

export default function ResourcesContent(props) {
    const [localData, setLocalData] = useState(props.dataFromGlobal);
    const [options, setOptions] = useState([])
    const [refresh, setRefresh] = useState(false);
    const [categoryInputOn, setCategoryInputOn] = useState(false);
    const [itemInputOn, setItemInputOn] = useState(false);

    function triggerRefresh() {
        setRefresh(!refresh);
        loadOptions();
    }

    function deleteResource(dlName) {
        const newld = localData;
        const filteredContent = newld.data[localData.selected]
            .filter((e) => {
                return dlName != e.name;
            })
        newld.data[localData.selected] = filteredContent;
        setLocalData(newld);
        triggerRefresh();
    }

    useEffect(() => {
        if (localData) {
            props.setData(props.counter, localData)
        }
    }, [localData])

    if (!localData || !localData.data) {
        let newLocalData = {};
        newLocalData.data = defaultResources;
        newLocalData.selected = "General";

        console.log(newLocalData);
        setLocalData(() => newLocalData);
    }

    function loadOptions() {
        setOptions(Object.keys(localData.data).map((option, index) => {
            let selected;
            if (option === localData.selected) {
                selected = "selected"
            }
            return <option selected={selected} key={index} value={option}>{option}</option>
        }))
    }

    useEffect(() => {
        loadOptions();
    }, [])

    console.log(localData);

    let inputSection = <></>
    if (categoryInputOn) {
        inputSection = <ResourceInput toggleCategory={setCategoryInputOn} inpType="category" localData={localData} setLocalData={setLocalData} triggerRefresh={triggerRefresh} refresh={refresh} />
    }
    else if (itemInputOn) {
        inputSection = <ResourceInput toggleCategory={setItemInputOn} inpType="item" localData={localData} setLocalData={setLocalData} triggerRefresh={triggerRefresh} />
    }

    try {
        return (
            <>
                <div>
                    <label htmlFor="resource-category-input">Select resources: </label>
                    <select value={localData.selected} onChange={(e) => { setLocalData({ ...localData, selected: e.target.value }) }} name="resource-category-input" id="resource-category-input" >
                        {options}
                    </select>
                    <button onClick={() => { setCategoryInputOn(!categoryInputOn); setItemInputOn(false) }}>Add category</button>
                    <button onClick={() => { setItemInputOn(!itemInputOn); setCategoryInputOn(false) }}>Add item</button>
                    {inputSection}
                    <Resources selected={localData.selected} data={localData} deleteResource={deleteResource} />
                </div>
            </>
        )
    }
    catch (error) {
        console.log(error);
    }

}
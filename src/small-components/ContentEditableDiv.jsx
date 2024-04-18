import { useRef, useEffect } from "react";


// Pass a value, class name, placeholder text and on change function
// This might be against how react is supposed to work but it seemed the easiest way have automatically resizing inputs
export function ContentEditableDiv(props) {
    const contentEditableRef = useRef();
    useEffect(() => {
        if (contentEditableRef.current.textContent !== props.value) {
            contentEditableRef.current.textContent = props.value;
        }
    });

    const className = props.class ? props.class : "";
    const style = props.style ? props.style : {};

    return (
        <div
            contentEditable="true"
            role="textbox"
            className={className}
            style={style}
            ref={contentEditableRef}
            Placeholder={props.Placeholder}
            onInput={event => {
                props.onChange(event.target.textContent);
            }} />
    );
}

// https://docs.dndkit.com/introduction/getting-started
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function Draggable(props) {
    const [defaultAssigned, setDefaultAssigned] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable',
    });
    console.log(props.defaultPos.x, props.defaultPos.y)
    console.log(transform);
    if (!defaultAssigned) {
        if (props.defaultPos && transform) {
            if ((transform.x != props.defaultPos.x) || (transform.y != props.defaultPos.y)) {
                console.log(props.defaultPos, transform)
                transform.x = props.defaultPos.x;
                transform.y = props.defaultPos.y;
                console.log(props.defaultPos, transform)
                setDefaultAssigned(true);
            }
        }
    }

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;


    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </button>
    );
}
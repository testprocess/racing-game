import React from 'react';


const Joystick = () => {
    let isActivate = false
    
    const [joystickPositionArray, setJoystickPosition] = React.useState([0,0,0,0])

    const joystickBody: any = React.useRef()
    const joystickControl: any = React.useRef()
    const joystickSvg: any = React.useRef()
    const joystickLine: any = React.useRef()

    
    React.useEffect(() => {
        document.addEventListener("mousedown", handleMousedown);
        document.addEventListener("mouseup", handleMouseup);
        document.addEventListener("mousemove", handleMousemove);
    }, []);


    const dispatchEvent = () => {
        let controlPosition = {
            x: Number(joystickControl.current.style.left.split('px')[0]),
            y: Number(joystickControl.current.style.top.split('px')[0])
        }

        let joystickPosition = {
            x: Number(joystickBody.current.style.left.split('px')[0]),
            y: Number(joystickBody.current.style.top.split('px')[0])
        }

        let radian = getAngle(controlPosition, joystickPosition)

        const event = new CustomEvent('onJoystickMove', {
            detail: {
                radian: radian
            }
        });
        document.dispatchEvent(event);
    }

    const dispatchEventStartMove = () => {
        const event = new CustomEvent('onJoystickStart');
        document.dispatchEvent(event);
    }

    const dispatchEventStopMove = () => {
        const event = new CustomEvent('onJoystickStop');
        document.dispatchEvent(event);
    }

    const handleMousedown = (e: any) => {
        joystickBody.current.classList.remove('d-none')
        joystickControl.current.classList.remove('d-none')

        isActivate = true
        dispatchEventStartMove()


        joystickBody.current.style.top = `${e.offsetY-12}px`
        joystickBody.current.style.left = `${e.offsetX-12}px`

        joystickControl.current.style.top = `${e.offsetY-12}px`
        joystickControl.current.style.left = `${e.offsetX-12}px`
    }

    const handleMouseup = (e: any) => {
        isActivate = false
        dispatchEventStopMove()

        joystickBody.current.classList.add('d-none')
        joystickControl.current.classList.add('d-none')
        joystickSvg.current.classList.add('d-none')

    }

    const handleMousemove = (e: any) => {
        if (isActivate) {
            joystickSvg.current.classList.remove('d-none')

            let controlPosition = {
                x: e.clientX-9,
                y: e.clientY-9
            }

            let joystickPosition = {
                x: Number(joystickBody.current.style.left.split('px')[0])+12,
                y: Number(joystickBody.current.style.top.split('px')[0])+12
            }

            joystickControl.current.style.top = `${controlPosition.y}px`
            joystickControl.current.style.left = `${controlPosition.x}px`

            setJoystickPosition([e.clientX, e.clientY, joystickPosition.x, joystickPosition.y])
            dispatchEvent()
        }
    }

    const getAngle = (p1: any, p2: any) => {
        if (isActivate) {
            let defX =  p1.x - p2.x;
            let defY =  p1.y - p2.y;
            let angle = Math.atan2(defY, defX);
            
            return angle;
        }
    }

    return (
        <div>
            <svg id="joystick-line" ref={joystickSvg} className="d-none">
                <line x1={joystickPositionArray[0]} y1={joystickPositionArray[1]} x2={joystickPositionArray[2]} y2={joystickPositionArray[3]} ref={joystickLine} style={{"stroke":"rgba(255, 255, 255, 0.72)", "strokeWidth": "2"}} />
            </svg>

            <div id="joystick" ref={joystickBody} className='d-none'></div>
            <div id="joystick-control" ref={joystickControl} className='d-none'></div>
        </div>

    )
}


export { Joystick }
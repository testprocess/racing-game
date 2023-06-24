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

        document.querySelector("#screen").addEventListener("touchstart", handleTouchdown);
        document.querySelector("#screen").addEventListener("touchend", handleTouchup);
        document.querySelector("#screen").addEventListener("touchmove", handleTouchmove);
        
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
        let disX = controlPosition.x - joystickPosition.x
        let dixY = controlPosition.y - joystickPosition.y
        let dist = Math.sqrt(Math.abs(disX * disX) + Math.abs(dixY * dixY))

        const event = new CustomEvent('onJoystickMove', {
            detail: {
                radian: radian,
                force: dist
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


    const handleDown = ({ x, y }: any) => {
        joystickBody.current.classList.remove('d-none')
        joystickControl.current.classList.remove('d-none')

        isActivate = true
        dispatchEventStartMove()


        joystickBody.current.style.top = `${y-12}px`
        joystickBody.current.style.left = `${x-12}px`

        joystickControl.current.style.top = `${y-12}px`
        joystickControl.current.style.left = `${x-12}px`
    }

    const handleUp = () => {
        isActivate = false
        dispatchEventStopMove()

        joystickBody.current.classList.add('d-none')
        joystickControl.current.classList.add('d-none')
        joystickSvg.current.classList.add('d-none')
    }

    const handleMove = ({ x, y }: any) => {
        if (isActivate) {
            joystickSvg.current.classList.remove('d-none')

            let controlPosition = {
                x: x-9,
                y: y-9
            }

            let joystickPosition = {
                x: Number(joystickBody.current.style.left.split('px')[0])+12,
                y: Number(joystickBody.current.style.top.split('px')[0])+12
            }

            joystickControl.current.style.top = `${controlPosition.y}px`
            joystickControl.current.style.left = `${controlPosition.x}px`

            setJoystickPosition([x, y, joystickPosition.x, joystickPosition.y])
            dispatchEvent()
        }
    }



    const handleMousedown = (e: any) => {
        handleDown({
            x: e.offsetX,
            y: e.offsetY
        })
    }

    const handleMouseup = (e: any) => {
        handleUp()

    }

    const handleMousemove = (e: any) => {
        handleMove({
            x: e.clientX,
            y: e.clientY
        })
    }


    const handleTouchdown = (e: any) => {
        handleDown({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        })
    }

    const handleTouchup = (e: any) => {
        handleUp()

    }

    const handleTouchmove = (e: any) => {
        handleMove({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        })
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
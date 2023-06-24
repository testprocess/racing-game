import React from 'react';
import './App.css'

import { Joystick } from './components/Joystick';
import { Progress } from './components/Progress';


const App: any = () => {
    return (
        <div>
            <Progress></Progress>
            <Joystick></Joystick>


        </div>
    );
};

export default App;
import React from 'react';


const Progress = () => {

    return ( 
        <div id='load' className='load text-center d-flex align-items-center justify-content-center'>  
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className='loadPercent' id='loadProg'>0%</p>

        </div>

    )
}


export { Progress }
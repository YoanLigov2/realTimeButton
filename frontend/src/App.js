import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

Pusher.logToConsole = true;
//coment
var pusher = new Pusher('fe962295d397897d3376', {
  cluster: 'eu'
});

var channel = pusher.subscribe('my-channel');

const Button = () => {
    channel.bind('my-event', function(data) {
      setIsOn(data.state);
    });

    const [isOn, setIsOn] = useState(false);
      
    useEffect(() => {
      fetchButtonState();
    }, []);

    async function pushData(data) {
      const res = await fetch('https://real-time-button.vercel.app/api/buttonState', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error('failed to push data');
      }
    }

    const handleButtonClick = async () => {
        try {
          await pushData({ isOn: !isOn });
        } catch (error) {
          console.error('Error updating button state:', error);
        }
      };
  
    const fetchButtonState = async () => {
      try {
        const state = await axios.get('https://real-time-button.vercel.app/api/buttonState');
        setIsOn(state.data.isOn);        
      } catch (error) {
        console.error('Error updating button state:', error);
      }
    };
  
    return (
      <div
      style={{
        width: "100vw",
        height: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
  
        <button 
        onClick={handleButtonClick} 
        style={{
              width: "200px",
              height: "100px",
              padding: '10px 20px',
              backgroundColor: isOn ? 'green' : 'red',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              outline: 'none'
            }}>
          {isOn ? 'On' : 'Off'} 
        </button>
      </div>
    );
  };
  
  export default Button;

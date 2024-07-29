import React from 'react';

const App = () => {
  return (
    <svg width={200} height={200} xmlns="http://www.w3.org/2000/svg">
      {/* <polygon points='100,0 120,80 100,95 80,80' fill='#000'>
        <animate attributeName='fill' values="#000;#fff;#000" keyTimes='0;0.8;1' begin="0s" dur="2s" repeatDur='indefinite' />
      </polygon>

      <polygon points='200,100 120,120 105,100 120,80' fill='#fff'>
        <animate attributeName='fill' values="#fff;#fff;#000;#fff" keyTimes='0;0.2;0.4;1' begin="0s" dur="2s" repeatDur='indefinite' />
      </polygon>

      <polygon points='100,200 120,120 100,105 80,120' fill='#fff'>
        <animate attributeName='fill' values="#fff;#fff;#000;#fff" keyTimes='0;0.4;0.6;1' begin="0s" dur="2s" repeatDur='indefinite' />
      </polygon>

      <polygon points='0,100 80,80 95,100 80,120' fill='#fff'>
        <animate attributeName='fill' values="#fff;#fff;#000;#fff" keyTimes='0;0.6;0.8;1' begin="0s" dur="2s" repeatDur='indefinite' />
      </polygon> */}

      <polygon points="100,0 120,80 100,95 80,80" fill="#000">
        <animate
          attributeName="fill"
          values="#000;#000;#fff;"
          keyTimes="0;0.25;1"
          begin="0s"
          dur="1s"
          repeatDur="indefinite"
        />
      </polygon>

      <polygon points="200,100 120,120 105,100 120,80" fill="#fff">
        <animate
          attributeName="fill"
          values="#fff;#fff;#000;#fff"
          keyTimes="0;0.25;0.5;1"
          begin="0s"
          dur="1s"
          repeatDur="indefinite"
        />
      </polygon>

      <polygon points="100,200 120,120 100,105 80,120" fill="#fff">
        <animate
          attributeName="fill"
          values="#fff;#fff;#000;#fff"
          keyTimes="0;0.5;0.75;1"
          begin="0s"
          dur="1s"
          repeatDur="indefinite"
        />
      </polygon>

      <polygon points="0,100 80,80 95,100 80,120" fill="#fff">
        <animate
          attributeName="fill"
          values="#fff;#fff;#000"
          keyTimes="0;0.75;0.8;1"
          begin="0s"
          dur="1s"
          repeatDur="indefinite"
        />
      </polygon>
    </svg>
  );
};

export default App;

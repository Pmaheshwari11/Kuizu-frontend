import react from 'react';

function Logo(){
    return(
    <h1 className="text-[100px] font-extrabold drop-shadow-xl mt-10 mb-8 flex gap-2 text-center w-full justify-center font-henny-penny">
    <svg height="120" width="400">
      <text
        fontSize="100"
        fontWeight="bold"
        x="10"
        y="100"
        stroke="black"
        strokeWidth="0.000001"
        fill="none"
      >
        <tspan fill="red">K</tspan>
        <tspan fill="orange">u</tspan>
        <tspan fill="yellow">i</tspan>
        <tspan fill="green">z</tspan>
        <tspan fill="blue">u</tspan>
        <tspan fill="purple">?</tspan>
      </text>
    </svg>
  </h1>
)};

export default Logo;


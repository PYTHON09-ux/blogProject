import React from 'react'

function Logo({width = '100px', color='white'}) {
  return (
   <h1>
    <div className={` text-xl hover:text-slate-400 animate-pulse text-${color} `}>🅱️LOGS</div>
   </h1> 
  )
}

export default Logo
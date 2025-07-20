import React from 'react'

function MetricCard({title, subText, metric}) {
  return (
     <div className="rounded-2xl pl-6 pr-2 py-8 bg-white w-[25rem] flex flex-col gap-2">
        <p className='text-[#787C85] Livvic-SemiBold text-lg'>{title}</p>
        <h1 className='Livvic-Bold text-6xl'>{metric}</h1>
         <p className='text-[#8A8E99] Livvic text-sm'>{subText}</p>
    </div>
  )
}

export default MetricCard
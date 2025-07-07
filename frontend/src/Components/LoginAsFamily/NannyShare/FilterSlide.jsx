import React, { useState, useEffect } from 'react'
import { Slider } from 'antd'
import { useSelector } from 'react-redux'

export default function FilterSlidersNannyShare({
    onLocationChange,
    onPriceChange,
    // onAvailabilityChange,
    onCareChange,
    maxChildrenChange,
    // onServicesChange,
    // onStartChange
}) {
    // State for sliders
    const { user } = useSelector(s => s.auth)
    const budgetRange = user?.additionalInfo
        .find(info => info.key === 'totalBudget')
        ?.value.option.split('to')
        .map(value => parseFloat(value.trim())) // Convert to numbers and remove any extra spaces


    const [locationValue, setLocationValue] = useState(5) // Location slider
    const [priceValue, setPriceValue] = useState(
        budgetRange ? [0, budgetRange[1]] : [0, 100]
    ) // Price slider
    const ageOfChildren = ['0-1yr old', '1-3yr old', '4-9yr old', '10+yr old']
    const [selectedCare, setSelectedCare] = useState([])
    // State for selected values
    // const [selectedAvailability, setSelectedAvailability] = useState([])
    // const [selectedStart, setSelectedStart] = useState([])

    // const [selectedServices, setSelectedServices] = useState([])

    // Notify parent when values change
    useEffect(() => {
        onLocationChange(locationValue)
    }, [locationValue, onLocationChange])

    useEffect(() => {
        onPriceChange(priceValue)
    }, [priceValue, onPriceChange])
    useEffect(() => {

    })
    // useEffect(() => {
    //     onAvailabilityChange(selectedAvailability)
    // }, [selectedAvailability, onAvailabilityChange])

    // useEffect(() => {
    //     onStartChange(selectedStart)
    // }, [selectedStart, onStartChange])

    useEffect(() => {
        onCareChange(selectedCare)
    }, [selectedCare, onCareChange])

    // useEffect(() => {
    //     onServicesChange(selectedServices)
    // }, [selectedServices, onServicesChange])

    // Toggle selection with smooth transition for any category
    const toggleSelection = (category, value) => {
        switch (category) {
            case 'care':
                const actualValue = value
                setSelectedCare(prev =>
                    prev.includes(actualValue)
                        ? prev.filter(item => item !== actualValue)
                        : [...prev, actualValue]
                )
                break
            // case 'start':
            //     setSelectedStart(prev =>
            //         prev.includes(value)
            //             ? prev.filter(item => item !== value)
            //             : [...prev, value]
            //     )
            //     break
            // case 'services':
            //     setSelectedServices(prev =>
            //         prev.includes(value)
            //             ? prev.filter(item => item !== value)
            //             : [...prev, value]
            //     )
            //     break
            default:
                break
        }
    }

    // Define a function to apply conditional styling
    const getOptionStyle = (category, value) => {
        const isSelected =
            category === 'care'
            && selectedCare.includes(value)
        // : category === 'availability'
        //     ? selectedAvailability.includes(value)
        //     : category === 'start'
        //         ? selectedStart.includes(value)
        //         : selectedServices.includes(value)

        return {
            background: isSelected
                ? 'linear-gradient(90deg, #FFF1F5 0%, #9EDCE1 100%)'
                : 'transparent',
            color: isSelected ? '#333' : '#666',
            borderColor: isSelected ? '#FFF1F5' : '#D6DDEB',
            transition: 'all 0.3s ease'
        }
    }

    return (
        <div className='border border-[#D6DDEB] bg-white p-4 rounded-2xl filter-width'>
            {/* Location Slider */}
            <div className=''>
                <h4 className='font-semibold text-2xl Classico'>Location</h4>
                <Slider
                    className=''
                    min={0}
                    max={50}
                    value={locationValue}
                    onChange={setLocationValue}
                    trackStyle={{
                        background: `${'linear-gradient(90deg, #FFF1F5 0%, #9EDCE1 100%)'}`
                    }}
                    handleStyle={{ borderColor: '#FF6B6B' }}
                />
                <p className='text-gray-500 text-sm'>
                    Within {locationValue}mi of 50, {user?.location?.format_location ? user?.location?.format_location : 'Your given location'}
                </p>
            </div>
            <hr className='border-1 my-4' />
            <div>
                <div>
                    <h4 className='font-semibold text-2xl Classico'>Price</h4>
                    <Slider
                        className=''
                        range
                        min={0}
                        max={1000}
                        value={priceValue}
                        onChange={setPriceValue}
                        trackStyle={{
                            background: `${window.location.pathname == '/nanny' ? 'linear-gradient(90deg, #FFF1F5 0%, #FFCADA 100%)' : 'linear-gradient(90deg, #FFF1F5 0%, #9EDCE1 100%)'}`
                        }}
                        handleStyle={[
                            { borderColor: '#FF6B6B' },
                            { borderColor: '#FF6B6B' }
                        ]}
                    />
                    <p className='text-gray-500 text-sm'>
                        Within ${priceValue[0]} - ${priceValue[1]}/hr
                    </p>
                </div>
                <hr className='border-1 my-4' />
            </div>

            <div className='mt-6'>
                <h4 className='font-semibold text-2xl Classico'>Number of Children</h4>
                <input
                    type="number"
                    min={1}
                    max={10}
                    placeholder="Enter number of children"
                    className="mt-2 w-full border rounded-full border-[#D6DDEB] px-4 py-2 outline-none focus:ring-2 focus:ring-[#9EDCE1]"
                    onChange={(e) => {
                        maxChildrenChange(parseInt(e.target.value))
                    }}
                />
            </div>
            <hr className='border-1 my-4' />
            {/* Services Options */}
            <div>
                <h4 className='font-semibold text-2xl  Classico'>Age of Children</h4>
                <div className='flex flex-wrap gap-x-2 gap-y-4 mt-3'>
                    {(ageOfChildren).map(option => (
                        <p
                            key={option}
                            onClick={() => toggleSelection('care', option)}
                            style={getOptionStyle('care', option)}
                            className='border-2 px-4 py-1 rounded-3xl text-gray-500 cursor-pointer'
                        >
                            {option}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}

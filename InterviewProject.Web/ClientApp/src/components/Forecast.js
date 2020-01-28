import React from 'react'

import './Forecast.css'

export const Forecast = (props) => {
    const { date, temperature, summary } = props

    return (<div className="forecast">
        <div className="date">{date}</div>
        <div className="temperature">{Math.round(temperature)} °C</div>
        <div className="summary">{summary}</div>
    </div>)
}
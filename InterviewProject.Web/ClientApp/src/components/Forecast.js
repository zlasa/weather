import React from 'react'

import './Forecast.css'

var moment = require('moment')

moment.updateLocale('en', {
    calendar: {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        sameElse: 'L'
    }
})

export const Forecast = (props) => {
    const { date, temperature, summary } = props

    return (<div className="forecast">
        <div className="date">{moment(date, 'YYYY-MM-DD').calendar()}</div>
        <div className="temperature">{Math.round(temperature)} °C</div>
        <div className="summary">{summary}</div>
    </div>)
}
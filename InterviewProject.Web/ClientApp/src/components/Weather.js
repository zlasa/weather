import React, { Component } from 'react'

import { Forecast } from './Forecast'

import './Weather.css'

export class Weather extends Component {
  static displayName = Weather.name

  constructor(props) {
    super(props)
    this.state = { forecast: [], searchLocation: '', ciUnits: true }
  }

  render() {
    const { selectedLocation, searchLocation, searchResults, forecast, loading, ciUnits } = this.state

    return (
      <div className="weather-root">
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p className="title">{selectedLocation ? `Selected location ${selectedLocation.title}` : 'Please search for a location.'}</p>
        <p className="units">
          <span>Selected units: </span>
          <span className={'unit ' + (ciUnits ? 'unit-active' : '')} onClick={() => this.setState({ ciUnits: true })}>°C</span>
          <span> | </span>
          <span className={'unit ' + (ciUnits ? '' : 'unit-active')} onClick={() => this.setState({ ciUnits: false })}>°F</span>
        </p>
        <div className="location-panel">
          <input placeholder="Search for a location" value={searchLocation} onChange={this.onSearchLocationChange} />
          {searchResults !== undefined &&
            (searchResults.length ?
              searchResults.map(l => <div key={l.id} className="location" onClick={() => { this.selectLocation(l) }}>{l.title}</div>) :
              <div className="empty">No results found</div>
            )}
        </div>
        <div className="forecast-panel">
          {loading ?
            <div className="loading">Loading...</div> :
            forecast.map(f => <Forecast key={selectedLocation.id + f.date} {...f} ciUnits={ciUnits} />)}
        </div>
      </div>
    )
  }

  onSearchLocationChange = (e) => {
    const searchLocation = e.target.value
    this.setState({
      searchLocation
    })
    clearTimeout(this.searchDebounceTimeout)
    this.searchDebounceTimeout = setTimeout(() => {
      this.searchLocation(searchLocation)
    }, 500)
  }

  searchLocation = async (input) => {
    const response = await fetch(`/api/locations?search=${input}`)
    response.json()
      .then(searchResults => this.setState({ searchResults }))
  }

  selectLocation = async (location) => {
    this.setState({
      searchLocation: '',
      searchResults: undefined,
      selectedLocation: location,
      loading: true
    })

    const response = await fetch(`/api/forecast/${location.id}`)
    response.json()
      .then(forecast => this.setState({
        forecast,
        loading: false
      }))
  }
}

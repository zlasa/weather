import React, { Component } from 'react'

import { Forecast } from './Forecast'

export class Weather extends Component {
  static displayName = Weather.name

  constructor(props) {
    super(props)
    this.state = { forecast: [], searchLocation: '' }
  }

  render() {
    const { selectedLocation, searchLocation, searchResults, forecast } = this.state

    return (
      <div>
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p className="title">{selectedLocation ? `Selected location ${selectedLocation.title}` : 'Please search for a location.'}</p>
        <input placeholder="Search for a location" value={searchLocation} onChange={this.onSearchLocationChange} />
        {searchResults !== undefined &&
          (searchResults.length ?
            searchResults.map(l => <div key={l.id} className="location" onClick={() => { this.selectLocation(l) }}>{l.title}</div>) :
            <div className="empty">No results found</div>
          )}
        {forecast.map((f, i) => <Forecast key={i} {...f} />)}
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
      selectedLocation: location
    })

    const response = await fetch(`/api/forecast/${location.id}`)
    response.json()
      .then(forecast => this.setState({ forecast }))
  }
}

import React, { Component } from 'react'

export class Weather extends Component {
  static displayName = Weather.name

  constructor(props) {
    super(props)
    this.state = { searchLocation: '' }
  }

  render() {
    const { selectedLocation, searchLocation, searchResults } = this.state

    return (
      <div>
        <h1 id="tabelLabel" >Weather forecast</h1>
        <p className="title">{selectedLocation ? `Selected location ${selectedLocation.title}` : 'Please search for a location.'}</p>
        <input placeholder="Search for a location" value={searchLocation} onChange={this.onSearchLocationChange} />
        {searchResults !== undefined &&
          (searchResults.length ?
            searchResults.map(l => <div key={l.woeid} className="location" onClick={() => { this.selectLocation(l) }}>{l.title}</div>) :
            <div className="empty">No results found</div>
          )}
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

  selectLocation = (location) => {
    this.setState({
      searchLocation: '',
      searchResults: undefined,
      selectedLocation: location
    })
  }
}

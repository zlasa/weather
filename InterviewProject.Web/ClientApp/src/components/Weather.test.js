import React from 'react'
import { shallow } from 'enzyme'

import { Weather } from './Weather'
import { Forecast } from './Forecast'

describe('Weather component', () => {
    let fixture
    let fetchResolve

    beforeEach(() => {
        fixture = shallow(<Weather />)
        fetch = jest.fn(() => new Promise(r => fetchResolve = r))
    })

    it('renders controls', () => {
        expect(fixture.find('h1').text()).toBe('Weather forecast')
        expect(fixture.find('p.title').text()).toBe('Please search for a location.')
        expect(fixture.find('p.units').text()).toBe('Selected units: °C | °F')
        expect(fixture.find('p.units .unit-active').text()).toBe('°C')
        expect(fixture.find('input').props()).toMatchObject({
            placeholder: 'Search for a location',
            value: ''
        })
    })

    describe('toggling units', () => {
        beforeEach(() => {
            fixture.find('p.units .unit').at(1).simulate('click')
        })

        it('should change units', () => {
            expect(fixture.find('p.units .unit-active').text()).toBe('°F')
        })
    })

    describe('typing into search box long input', () => {

        beforeEach(() => {
            jest.useFakeTimers()
            fixture.find('input').simulate('change', { target: { value: 'A'.repeat(100) } })
            jest.runAllTimers()
        })

        it('should render typed text and send a request', () => {
            expect(fixture.find('input').prop('value')).toBe('A'.repeat(100))
            expect(fixture.find('div.search-invalid').text()).toBe('Provided input seems to be invalid. Try something else.')
            expect(fetch).toHaveBeenCalledTimes(0)
        })
    })

    describe('typing into search box', () => {

        beforeEach(() => {
            jest.useFakeTimers()
            fixture.find('input').simulate('change', { target: { value: 'Ab' } })
            jest.runAllTimers()
        })

        it('should render typed text and send a request', () => {
            expect(fixture.find('input').prop('value')).toBe('Ab')

            expect(fetch).toHaveBeenCalledTimes(1)
            expect(fetch).toHaveBeenCalledWith("/api/locations?search=Ab")
        })

        describe('successful empty response', () => {
            beforeEach(() => {
                const locations = []
                fetchResolve(new Response(JSON.stringify(locations)))
            })

            it('should render no results', () => {
                expect(fixture.find('div.empty').text()).toBe('No results found')
            })
        })

        describe('when successful response', () => {
            beforeEach(() => {
                const locations = [
                    { id: 'id1', title: 'city 1' },
                    { id: 'id2', title: 'city 3' }
                ]
                fetchResolve(new Response(JSON.stringify(locations)))
            })

            it('should render locations', () => {
                expect(fixture.find('div.location').map(e => e.text())).toEqual(['city 1', 'city 3'])
            })

            describe('selecting a location', () => {

                beforeEach(() => {
                    fixture.find('div.location').at(1).simulate('click')
                    jest.runAllTimers()
                })

                it('should update title and clear locations list and input', () => {
                    expect(fixture.find('p.title').text()).toBe('Selected location city 3')
                    expect(fixture.find('div.location')).toHaveLength(0)
                    expect(fixture.find('input').prop('value')).toBe('')
                    expect(fixture.find('div.loading').text()).toBe('Loading...')
                })

                it('should make a request for a weather forecast', () => {
                    expect(fetch).toHaveBeenCalledTimes(2)
                    expect(fetch).toHaveBeenLastCalledWith("/api/forecast/id2")
                })

                describe('when successful response', () => {

                    let forecast

                    beforeEach(() => {
                        forecast = [
                            { date: '2020-01-01', summary: 'Hail', temp: 3, ciUnits: true },
                            { date: '2020-01-02', summary: 'Snow', temp: -5, ciUnits: true },
                            { date: '2020-01-03', summary: 'Heavy Rain', temp: 15, ciUnits: true }
                        ]
                        fetchResolve(new Response(JSON.stringify(forecast)))
                    })

                    it('should render weather forecast', () => {
                        expect(fixture.find('div.loading').exists()).toBe(false)
                        expect(fixture.find(Forecast).map(e => e.props())).toEqual(forecast)
                    })

                    describe('toggling units', () => {
                        beforeEach(() => {
                            fixture.find('p.units .unit').at(1).simulate('click')
                        })

                        it('should change units', () => {
                            const expected = forecast.map(f => ({ ...f, ciUnits: false }))
                            expect(fixture.find(Forecast).map(e => e.props())).toEqual(expected)
                        })
                    })
                })
            })
        })
    })
})
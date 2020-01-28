import React from 'react'
import { shallow } from 'enzyme'

import { Weather } from './Weather'

describe('Weather component', () => {
    let fixture

    beforeEach(() => {
        fixture = shallow(<Weather />)
    })

    it('renders controls', () => {
        expect(fixture.find('h1').text()).toBe('Weather forecast')
        expect(fixture.find('p.title').text()).toBe('Please search for a location.')
        expect(fixture.find('input').props()).toMatchObject({
            placeholder: 'Search for a location',
            value: ''
        })
    })

    describe('typing into search box', () => {

        let fetchResolve

        beforeEach(() => {
            jest.useFakeTimers()
            fetch = jest.fn(() => new Promise(r => fetchResolve = r))
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

        describe('successful response', () => {
            beforeEach(() => {
                const locations = [
                    { woeid: 'id1', title: 'city 1' },
                    { woeid: 'id2', title: 'city 3' }
                ]
                fetchResolve(new Response(JSON.stringify(locations)))
            })

            it('should render locations', () => {
                expect(fixture.find('div.location').map(e => e.text())).toEqual(['city 1', 'city 3'])
            })

            describe('selecting a location', () => {
                beforeEach(() => {
                    fixture.find('div.location').at(1).simulate('click')
                })

                it('should update title and clear locations list and input', () => {
                    expect(fixture.find('p.title').text()).toBe('Selected location city 3')
                    expect(fixture.find('div.location')).toHaveLength(0)
                    expect(fixture.find('input').prop('value')).toBe('')
                })
            })
        })
    })
})
import React from 'react'
import { shallow } from 'enzyme'

import { Forecast } from './Forecast'

describe('Forecast component', () => {
    it('should render', () => {
        const fixture = shallow(<Forecast date="2020-01-01" temperature={12.34} summary="Snow" />)
        expect(fixture.find('div.date').text()).toBe('2020-01-01')
        expect(fixture.find('div.temperature').text()).toBe('12 °C')
        expect(fixture.find('div.summary').text()).toBe('Snow')
    })

    it('should round temperature', () => {
        const fixture = shallow(<Forecast date="2020-01-01" temperature={12.64} summary="Snow" />)
        expect(fixture.find('div.temperature').text()).toBe('13 °C')
        fixture.setProps({ temperature: 15.5 })
        expect(fixture.find('div.temperature').text()).toBe('16 °C')
    })
})
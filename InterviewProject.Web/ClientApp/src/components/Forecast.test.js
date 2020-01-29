import React from 'react'
import { shallow } from 'enzyme'

import { Forecast } from './Forecast'

var moment = require('moment')

describe('Forecast component', () => {
    it('should render', () => {
        const fixture = shallow(<Forecast date="2020-01-01" temperature={12.34} summary="Snow" ciUnits={true} />)
        expect(fixture.find('div.date').text()).toBe('01/01/2020')
        expect(fixture.find('div.temperature').text()).toBe('12 °C')
        expect(fixture.find('div.summary').text()).toBe('Snow')
    })

    it('should round temperature', () => {
        const fixture = shallow(<Forecast date="2020-01-01" temperature={12.64} summary="Snow" ciUnits={true} />)
        expect(fixture.find('div.temperature').text()).toBe('13 °C')
        fixture.setProps({ temperature: 15.5 })
        expect(fixture.find('div.temperature').text()).toBe('16 °C')
    })

    it('should format date', () => {
        const fixture = shallow(<Forecast date={moment().format('YYYY-MM-DD')} temperature={12.64} summary="Snow" ciUnits={true} />)
        expect(fixture.find('div.date').text()).toBe('Today')
        fixture.setProps({ date: moment().add(1, 'day').format('YYYY-MM-DD') })
        expect(fixture.find('div.date').text()).toBe('Tomorrow')
    })

    it('should convert temperature', () => {
        const fixture = shallow(<Forecast date={moment().format('YYYY-MM-DD')} temperature={23} summary="Snow" ciUnits={false} />)
        expect(fixture.find('div.temperature').text()).toBe('73 °F')
        fixture.setProps({ temperature: -32 })
        expect(fixture.find('div.temperature').text()).toBe('-26 °F')
    })
})
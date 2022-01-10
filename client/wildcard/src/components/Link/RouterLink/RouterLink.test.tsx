import { render } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { RouterLink } from './RouterLink'

describe('RouterLink', () => {
    it('renders router link correctly', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <RouterLink to="/docs">Link to docs</RouterLink>
            </BrowserRouter>
        )
        expect(asFragment()).toMatchSnapshot()
    })
    it('should render correctly with absolute uri', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <RouterLink to="https://sourcegraph.com/docs">Link to docs</RouterLink>
            </BrowserRouter>
        )
        expect(asFragment()).toMatchSnapshot()
    })
    it('should render correctly without using Router', () => {
        const { asFragment } = render(<RouterLink to="/docs">Link to docs</RouterLink>)
        expect(asFragment()).toMatchSnapshot()
    })
})

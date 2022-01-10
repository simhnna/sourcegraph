import { render } from '@testing-library/react'
import React from 'react'

import { renderWithRouter } from '@sourcegraph/shared/src/testing/render-with-router'

import { ButtonLink } from './ButtonLink'

describe('<ButtonLink />', () => {
    test('renders correctly btn classes', () => {
        const { asFragment } = render(
            <ButtonLink to="http://example.com" variant="secondary" size="lg">
                Button link
            </ButtonLink>
        )
        expect(asFragment()).toMatchSnapshot()
    })
    test('renders correctly `disabled`', () => {
        const { asFragment } = render(
            <ButtonLink to="http://example.com" variant="secondary" size="lg" disabled={true}>
                Button link
            </ButtonLink>
        )
        expect(asFragment()).toMatchSnapshot()
    })
    test('renders correctly empty `to`', () => {
        const { asFragment } = render(
            <ButtonLink to={undefined} variant="secondary" size="lg">
                Button link
            </ButtonLink>
        )
        expect(asFragment()).toMatchSnapshot()
    })
    test('renders correctly anchor attributes', () => {
        const { asFragment } = renderWithRouter(
            <ButtonLink
                to="https://sourcegraph.com"
                variant="secondary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                data-tooltip="SourceGraph.com"
                data-pressed="true"
            >
                Button link
            </ButtonLink>
        )
        expect(asFragment()).toMatchSnapshot()
    })
})

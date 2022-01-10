import { Meta, Story } from '@storybook/react'
import React from 'react'

import { BrandedStory } from '@sourcegraph/branded/src/components/BrandedStory'
import webStyles from '@sourcegraph/web/src/SourcegraphWebApp.scss'
import { Grid } from '@sourcegraph/wildcard'

import { ButtonLink } from '.'

const Config: Meta = {
    title: 'wildcard/ButtonLink',

    decorators: [
        story => (
            <BrandedStory styles={webStyles}>{() => <div className="container mt-3">{story()}</div>}</BrandedStory>
        ),
    ],

    parameters: {
        component: ButtonLink,
    },
}

export default Config

export const Simple: Story = () => (
    <>
        <h3>Simple button link</h3>
        <ButtonLink target="_blank" rel="noopener noreferrer" variant="primary" to="http://example.com">
            Click me!
        </ButtonLink>
        <br />
        <h3>Button link with undefined to property</h3>
        <ButtonLink variant="primary" to={undefined}>
            Click me
        </ButtonLink>
        <br />
        <h3>Button link sizes</h3>

        <ButtonLink variant="primary" to="#" size="sm">
            Small Size
        </ButtonLink>
        <br />
        <br />
        <ButtonLink variant="primary" to="#" size="lg">
            Large Size
        </ButtonLink>
        <br />
        <h3>Button link variants</h3>
        <Grid>
            <ButtonLink to="#" variant="primary">
                Primary
            </ButtonLink>
            <ButtonLink to="#" variant="secondary">
                Secondary
            </ButtonLink>
            <ButtonLink to="#" variant="danger">
                Danger
            </ButtonLink>
            <ButtonLink to="#" variant="success">
                Success
            </ButtonLink>
            <ButtonLink to="#" variant="warning">
                Warning
            </ButtonLink>
            <ButtonLink to="#" variant="info">
                Info
            </ButtonLink>
            <ButtonLink to="#" variant="merged">
                Merged
            </ButtonLink>
        </Grid>
    </>
)

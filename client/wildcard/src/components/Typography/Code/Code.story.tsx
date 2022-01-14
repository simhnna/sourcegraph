import { select } from '@storybook/addon-knobs'
import { DecoratorFn, Meta, Story } from '@storybook/react'
import React from 'react'

import { BrandedStory } from '@sourcegraph/branded/src/components/BrandedStory'
import webStyles from '@sourcegraph/web/src/SourcegraphWebApp.scss'

import { Grid } from '../..'
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_WEIGHTS } from '../constants'

import { Code } from './Code'

const sampleContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const decorator: DecoratorFn = story => <BrandedStory styles={webStyles}>{() => <div>{story()}</div>}</BrandedStory>

const config: Meta = {
    title: 'wildcard/Typography/Code',

    decorators: [decorator],

    parameters: {
        component: Code,
        design: {
            type: 'figma',
            name: 'Figma',
            url: 'https://www.figma.com/file/NIsN34NH7lPu04olBzddTw/Wildcard-Design-System?node-id=5601%3A65477',
        },
    },
}

export default config

export const AllProperties: Story = () => (
    <>
        <h1>Code</h1>

        <h2>Size</h2>
        <p>
            <Grid columnCount={TYPOGRAPHY_SIZES.length}>
                {TYPOGRAPHY_SIZES.map(size => (
                    <div key={size}>
                        <h3>{size}</h3>
                        <Code size={size}>{sampleContent}</Code>
                    </div>
                ))}
            </Grid>
        </p>

        <h2>Weight</h2>
        <p>
            <Grid columnCount={TYPOGRAPHY_WEIGHTS.length}>
                {TYPOGRAPHY_WEIGHTS.map(weight => (
                    <div key={weight}>
                        <h3>{weight}</h3>
                        <Code weight={weight}>{sampleContent}</Code>
                    </div>
                ))}
            </Grid>
        </p>
    </>
)

export const Simple: Story = () => (
    <Code weight={select('weight', TYPOGRAPHY_WEIGHTS, undefined)} size={select('size', TYPOGRAPHY_SIZES, undefined)}>
        {sampleContent}
    </Code>
)

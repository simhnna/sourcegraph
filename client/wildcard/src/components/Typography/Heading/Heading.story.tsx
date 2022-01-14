import { select } from '@storybook/addon-knobs'
import { DecoratorFn, Meta, Story } from '@storybook/react'
import React from 'react'

import { BrandedStory } from '@sourcegraph/branded/src/components/BrandedStory'
import webStyles from '@sourcegraph/web/src/SourcegraphWebApp.scss'

import { Grid } from '../..'
import { TYPOGRAPHY_ALIGNMENTS, TYPOGRAPHY_MODES } from '../constants'

import { Heading } from './Heading'

import { H1, H2, H3, H4, H5, H6 } from '.'

const decorator: DecoratorFn = story => <BrandedStory styles={webStyles}>{() => <div>{story()}</div>}</BrandedStory>

const config: Meta = {
    title: 'wildcard/Typography/Headings',

    decorators: [decorator],

    parameters: {
        component: Heading,
        design: {
            type: 'figma',
            name: 'Figma',
            url: 'https://www.figma.com/file/NIsN34NH7lPu04olBzddTw/Wildcard-Design-System?node-id=5601%3A65477',
        },
    },
}

export default config

export const Simple: Story = () => (
    <div>
        <H1
            mode={select('mode', TYPOGRAPHY_MODES, undefined)}
            alignment={select('alignment', TYPOGRAPHY_ALIGNMENTS, undefined)}
        >
            This is H1 Lorem ipsum dolor sit amet.
        </H1>
        <H2
            mode={select('mode', TYPOGRAPHY_MODES, undefined)}
            alignment={select('alignment', TYPOGRAPHY_ALIGNMENTS, undefined)}
        >
            This is H2 Lorem ipsum dolor sit amet.
        </H2>
        <H3
            mode={select('mode', TYPOGRAPHY_MODES, undefined)}
            alignment={select('alignment', TYPOGRAPHY_ALIGNMENTS, undefined)}
        >
            This is H3 Lorem ipsum dolor sit amet.
        </H3>
        <H4
            mode={select('mode', TYPOGRAPHY_MODES, undefined)}
            alignment={select('alignment', TYPOGRAPHY_ALIGNMENTS, undefined)}
        >
            This is H4 Lorem ipsum dolor sit amet.
        </H4>
        <H5
            mode={select('mode', TYPOGRAPHY_MODES, undefined)}
            alignment={select('alignment', TYPOGRAPHY_ALIGNMENTS, undefined)}
        >
            This is H5 Lorem ipsum dolor sit amet.
        </H5>
        <H6
            mode={select('mode', TYPOGRAPHY_MODES, undefined)}
            alignment={select('alignment', TYPOGRAPHY_ALIGNMENTS, undefined)}
        >
            This is H6 Lorem ipsum dolor sit amet.
        </H6>
    </div>
)

export const AllProperties: Story = () => (
    <div>
        <h1>Code</h1>

        <h2>Alignment</h2>
        <p>
            <Grid columnCount={TYPOGRAPHY_ALIGNMENTS.length}>
                {TYPOGRAPHY_ALIGNMENTS.map(alignment => (
                    <div key={alignment}>
                        <h3>{alignment}</h3>
                        <H1 alignment={alignment}>This is H1 Lorem ipsum dolor sit amet.</H1>
                        <H2 alignment={alignment}>This is H2 Lorem ipsum dolor sit amet.</H2>
                        <H3 alignment={alignment}>This is H3 Lorem ipsum dolor sit amet.</H3>
                        <H4 alignment={alignment}>This is H4 Lorem ipsum dolor sit amet.</H4>
                        <H5 alignment={alignment}>This is H5 Lorem ipsum dolor sit amet.</H5>
                        <H6 alignment={alignment}>This is H6 Lorem ipsum dolor sit amet.</H6>
                    </div>
                ))}
            </Grid>
        </p>

        <h2>Mode</h2>
        <p>
            <Grid columnCount={3}>
                {TYPOGRAPHY_MODES.map(mode => (
                    <div key={mode} className="overflow-hidden">
                        <h3>{mode}</h3>
                        <H1 mode={mode}>This is H1 Lorem ipsum dolor sit amet.</H1>
                        <H2 mode={mode}>This is H2 Lorem ipsum dolor sit amet.</H2>
                        <H3 mode={mode}>This is H3 Lorem ipsum dolor sit amet.</H3>
                        <H4 mode={mode}>This is H4 Lorem ipsum dolor sit amet.</H4>
                        <H5 mode={mode}>This is H5 Lorem ipsum dolor sit amet.</H5>
                        <H6 mode={mode}>This is H6 Lorem ipsum dolor sit amet.</H6>
                    </div>
                ))}
            </Grid>
        </p>
    </div>
)

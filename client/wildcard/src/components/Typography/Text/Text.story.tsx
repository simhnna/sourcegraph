import { select } from '@storybook/addon-knobs'
import { DecoratorFn, Meta, Story } from '@storybook/react'
import React from 'react'

import { BrandedStory } from '@sourcegraph/branded/src/components/BrandedStory'
import webStyles from '@sourcegraph/web/src/SourcegraphWebApp.scss'

import { Grid } from '../..'
import { TYPOGRAPHY_ALIGNMENTS, TYPOGRAPHY_MODES, TYPOGRAPHY_SIZES, TYPOGRAPHY_WEIGHTS } from '../constants'

import { Text } from './Text'

const sampleContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
const decorator: DecoratorFn = story => <BrandedStory styles={webStyles}>{() => <div>{story()}</div>}</BrandedStory>

const config: Meta = {
    title: 'wildcard/Typography/Text',

    decorators: [decorator],

    parameters: {
        component: Text,
        design: {
            type: 'figma',
            name: 'Figma',
            url: 'https://www.figma.com/file/NIsN34NH7lPu04olBzddTw/Wildcard-Design-System?node-id=5601%3A65477',
        },
    },
}

export default config

export const Simple: Story = () => (
    <Text
        weight={select('weight', TYPOGRAPHY_WEIGHTS, undefined)}
        size={select('size', TYPOGRAPHY_SIZES, undefined)}
        mode={select('mode', TYPOGRAPHY_MODES, undefined)}
        alignment={select('alignment', TYPOGRAPHY_ALIGNMENTS, undefined)}
    >
        {sampleContent}
    </Text>
)

export const AllProperties: Story = () => (
    <>
        <h1>Text</h1>

        <h2>Size</h2>
        <p>
            <Grid columnCount={TYPOGRAPHY_SIZES.length}>
                {TYPOGRAPHY_SIZES.map(size => (
                    <div key={size}>
                        <h3>{size}</h3>
                        <Text size={size}>{sampleContent}</Text>
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
                        <Text weight={weight}>{sampleContent}</Text>
                    </div>
                ))}
            </Grid>
        </p>

        <h2>Alignment</h2>
        <p>
            <Grid columnCount={TYPOGRAPHY_ALIGNMENTS.length}>
                {TYPOGRAPHY_ALIGNMENTS.map(alignment => (
                    <div key={alignment}>
                        <h3>{alignment}</h3>
                        <Text alignment={alignment}>{sampleContent}</Text>
                    </div>
                ))}
            </Grid>
        </p>

        <h2>Mode</h2>
        <p>
            <Grid columnCount={TYPOGRAPHY_MODES.length}>
                {TYPOGRAPHY_MODES.map(mode => (
                    <div key={mode} className="overflow-hidden">
                        <h3>{mode}</h3>
                        <Text mode={mode}>{sampleContent}</Text>
                    </div>
                ))}
            </Grid>
        </p>
    </>
)

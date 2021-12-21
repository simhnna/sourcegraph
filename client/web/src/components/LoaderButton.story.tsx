import { storiesOf } from '@storybook/react'
import React from 'react'

import { Button } from '@sourcegraph/wildcard'

import { LoaderButton } from './LoaderButton'
import { WebStory } from './WebStory'

const { add } = storiesOf('web/LoaderButton', module).addDecorator(story => (
    <div className="container mt-3" style={{ width: 800 }}>
        {story()}
    </div>
))

add('Inline', () => (
    <WebStory>
        {() => (
            <p>
                <Button loading={true} label="loader button" variant="primary" as={LoaderButton} />
            </p>
        )}
    </WebStory>
))

add('Block', () => (
    <WebStory>
        {() => (
            <Button loading={true} label="loader button" className="btn-block" variant="primary" as={LoaderButton} />
        )}
    </WebStory>
))

add('With label', () => (
    <WebStory>
        {() => (
            <Button
                alwaysShowLabel={true}
                loading={true}
                label="loader button"
                className="btn-block"
                variant="primary"
                as={LoaderButton}
            />
        )}
    </WebStory>
))

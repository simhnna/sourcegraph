import classNames from 'classnames'
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { TelemetryProps } from '@sourcegraph/shared/src/telemetry/telemetryService'
import { ThemeProps } from '@sourcegraph/shared/src/theme'
import { ProductStatusBadge } from '@sourcegraph/wildcard'

import { BrandLogo } from '../components/branding/BrandLogo'
import { FeatureFlagProps } from '../featureFlags/featureFlags'
import { AuthProvider, SourcegraphContext } from '../jscontext'

import { ExternalsAuth } from './ExternalsAuth'
import { OrDivider } from './OrDivider'
import { SignUpArguments, SignUpForm } from './SignUpForm'
import styles from './VsCodeSignUpPage.module.scss'

interface Props extends ThemeProps, TelemetryProps, FeatureFlagProps {
    source: string | null
    showEmailForm: boolean
    /** Called to perform the signup on the server. */
    onSignUp: (args: SignUpArguments) => Promise<void>
    context: Pick<SourcegraphContext, 'authProviders' | 'experimentalFeatures'>
}

const SourceToTitleMap = {
    Context: 'Easily search the code you care about.',
    OptimisedContext: 'Easily search the code you care about, for free.',
}

/**
 * Sign up page specifically from users via our VS Code integration
 */
export const VsCodeSignUpPage: React.FunctionComponent<Props> = ({
    isLightTheme,
    showEmailForm,
    onSignUp,
    context,
    telemetryService,
    featureFlags,
}) => {
    const location = useLocation()
    const isSignupOptimised = featureFlags.get('signup-optimization')

    const query = new URLSearchParams(location.search)

    const assetsRoot = window.context?.assetsRoot || ''
    const title = isSignupOptimised ? SourceToTitleMap.OptimisedContext : SourceToTitleMap.Context // Use Context as default

    const logEvent = (type: AuthProvider['serviceType']): void => {
        const eventType = type === 'builtin' ? 'form' : type
        telemetryService.log('SignupInitiated', { type: eventType }, { type: eventType })
    }

    const signUpForm = (
        <SignUpForm
            featureFlags={featureFlags}
            onSignUp={args => {
                logEvent('builtin')
                return onSignUp(args)
            }}
            context={{ authProviders: [], sourcegraphDotComMode: true }}
            buttonLabel="Sign up"
            experimental={true}
            className="my-3"
        />
    )

    const renderSignupOptimized = (): JSX.Element => (
        <>
            {signUpForm}
            <div className={classNames('d-flex justify-content-center', styles.helperText)}>
                <span className="mr-1">Have an account?</span>
                <Link to={`/sign-in${location.search}`}>Log in</Link>
            </div>

            <OrDivider className="mt-4 mb-4 text-lowercase" />

            <ExternalsAuth
                withCenteredText={true}
                context={context}
                githubLabel="Sign up with GitHub"
                gitlabLabel="Sign up with GitLab"
                onClick={logEvent}
            />
        </>
    )

    const renderCodeHostAuth = (): JSX.Element => (
        <>
            <ExternalsAuth
                context={context}
                githubLabel="Continue with GitHub"
                gitlabLabel="Continue with GitLab"
                onClick={logEvent}
            />

            <div className="mb-4">
                Or, <Link to={`${location.pathname}?${query.toString()}`}>continue with email</Link>
            </div>
        </>
    )

    const renderEmailAuthForm = (): JSX.Element => (
        <>
            <small className="d-block mt-3">
                <Link className="d-flex align-items-center" to={`${location.pathname}?${query.toString()}`}>
                    <ChevronLeftIcon className={classNames('icon-inline', styles.backIcon)} />
                    Go back
                </Link>
            </small>

            {signUpForm}
        </>
    )

    const renderAuthMethod = (): JSX.Element => (showEmailForm ? renderEmailAuthForm() : renderCodeHostAuth())

    return (
        <div className={styles.page}>
            <header>
                <div className="position-relative">
                    <div className={styles.headerBackground1} />
                    <div className={styles.headerBackground2} />
                    <div className={styles.headerBackground3} />

                    <div className={styles.limitWidth}>
                        <BrandLogo isLightTheme={isLightTheme} variant="logo" className={styles.logo} />
                    </div>
                </div>

                <div className={styles.limitWidth}>
                    <h2 className={classNames('d-flex', 'align-items-center', styles.pageHeading)}>{title}</h2>
                </div>
            </header>

            <div className={classNames(styles.contents, styles.limitWidth)}>
                <div className={styles.contentsLeft}>
                    With a Sourcegraph account, you can also:
                    <ul className={styles.featureList}>
                        <li>
                            <div className="d-flex align-items-center">
                                <ProductStatusBadge status="beta" className="text-uppercase mr-1" /> Search across all
                                your public and private repositories
                            </div>
                        </li>
                        <li>Monitor code for changes</li>
                        <li>Navigate through code directly from Visual Studio Code</li>
                        <li>Integrate data, tooling, and code in a single location </li>
                    </ul>
                    <div className={styles.companiesHeader}>
                        Trusted by developers at the world's most innovative companies:
                    </div>
                    <img
                        src={`${assetsRoot}/img/customer-logos-${isLightTheme ? 'light' : 'dark'}.svg`}
                        alt="Cloudflare, Uber, SoFi, Dropbox, Plaid, Toast"
                    />
                </div>

                <div className={styles.signUpWrapper}>
                    <h2>Create a free account</h2>
                    {isSignupOptimised ? renderSignupOptimized() : renderAuthMethod()}

                    <small className="text-muted">
                        By registering, you agree to our{' '}
                        <a href="https://about.sourcegraph.com/terms" target="_blank" rel="noopener">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="https://about.sourcegraph.com/privacy" target="_blank" rel="noopener">
                            Privacy Policy
                        </a>
                        .
                    </small>

                    {!isSignupOptimised && (
                        <>
                            <hr className={styles.separator} />

                            <div>
                                Already have an account? <Link to={`/sign-in${location.search}`}>Log in</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

import isAbsoluteUrl from 'is-absolute-url'
import * as React from 'react'
import { __RouterContext } from 'react-router'
import { Link } from 'react-router-dom'

import { AnchorLink, LinkProps } from '../AnchorLink'

export function useInRouterContext(): boolean {
    return Boolean(React.useContext(__RouterContext))
}

export const RouterLink: React.FunctionComponent<LinkProps> = React.forwardRef(
    ({ to, children, ...rest }: LinkProps, reference) => {
        const isInRouter = useInRouterContext()
        const shouldUseAnchor = !isInRouter || (typeof to === 'string' && isAbsoluteUrl(to))

        return (
            <AnchorLink to={to} as={shouldUseAnchor ? undefined : Link} {...rest} ref={reference}>
                {children}
            </AnchorLink>
        )
    }
)

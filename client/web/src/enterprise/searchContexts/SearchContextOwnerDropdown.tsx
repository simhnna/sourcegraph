import { MenuItems } from '@reach/menu-button'
import classNames from 'classnames'
import React, { useMemo } from 'react'

import { Namespace } from '@sourcegraph/shared/src/graphql/schema'
import { Menu, MenuButton } from '@sourcegraph/wildcard'

import { AuthenticatedUser } from '../../auth'

import styles from './SearchContextOwnerDropdown.module.scss'

export type SelectedNamespaceType = 'user' | 'org' | 'global-owner'

export interface SelectedNamespace {
    id: string | null
    type: SelectedNamespaceType
    name: string
}

export function getSelectedNamespace(namespace: Namespace | null): SelectedNamespace {
    if (!namespace) {
        return { id: null, type: 'global-owner', name: '' }
    }
    return {
        id: namespace.id,
        type: namespace.__typename === 'User' ? 'user' : 'org',
        name: namespace.namespaceName,
    }
}

export function getSelectedNamespaceFromUser(authenticatedUser: AuthenticatedUser): SelectedNamespace {
    return {
        id: authenticatedUser.id,
        type: 'user',
        name: authenticatedUser.username,
    }
}

export interface SearchContextOwnerDropdownProps {
    isDisabled: boolean
    authenticatedUser: AuthenticatedUser
    selectedNamespace: SelectedNamespace
    setSelectedNamespace: (selectedNamespace: SelectedNamespace) => void
}

export const SearchContextOwnerDropdown: React.FunctionComponent<SearchContextOwnerDropdownProps> = ({
    isDisabled,
    authenticatedUser,
    selectedNamespace,
    setSelectedNamespace,
}) => {
    // const [isOpen, setIsOpen] = useState(false)
    // const toggleIsOpen = useCallback(() => setIsOpen(open => !open), [])

    const selectedUserNamespace = useMemo(() => getSelectedNamespaceFromUser(authenticatedUser), [authenticatedUser])
    return (
        <Menu>
            <MenuButton
                className={classNames('form-control', styles.searchContextOwnerDropdownToggle)}
                color="outline-secondary"
                disabled={isDisabled}
                data-tooltip={isDisabled ? "Owner can't be changed." : ''}
            >
                <div>{selectedNamespace.type === 'global-owner' ? 'Global' : `@${selectedNamespace.name}`}</div>
            </MenuButton>
            <Menu>
                <MenuItems onClick={() => setSelectedNamespace(selectedUserNamespace)}>
                    @{authenticatedUser.username} <span className="text-muted">(you)</span>
                </MenuItems>
                {authenticatedUser.organizations.nodes.map(org => (
                    <MenuItems
                        key={org.name}
                        onClick={() => setSelectedNamespace({ id: org.id, type: 'org', name: org.name })}
                    >
                        @{org.name}
                    </MenuItems>
                ))}
                {authenticatedUser.siteAdmin && (
                    <>
                        <hr />
                        <MenuItems onClick={() => setSelectedNamespace({ id: null, type: 'global-owner', name: '' })}>
                            <div>Global owner</div>
                            <div className="text-muted">Available to everyone.</div>
                        </MenuItems>
                    </>
                )}
            </Menu>
        </Menu>
    )
}

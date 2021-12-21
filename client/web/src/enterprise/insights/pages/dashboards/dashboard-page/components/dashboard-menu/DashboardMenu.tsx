import { Menu, MenuButton, MenuItem, MenuItemProps, MenuItems, MenuPopover } from '@reach/menu-button'
import classNames from 'classnames'
import DotsVerticalIcon from 'mdi-react/DotsVerticalIcon'
import React from 'react'

import { Button } from '@sourcegraph/wildcard'

import { positionBottomRight } from '../../../../../components/context-menu/utils'
import { InsightDashboard } from '../../../../../core/types'
import { SupportedInsightSubject } from '../../../../../core/types/subjects'
import { getTooltipMessage, useDashboardPermissions } from '../../hooks/use-dashboard-permissions'

import styles from './DashboardMenu.module.scss'

export enum DashboardMenuAction {
    CopyLink,
    Delete,
    Configure,
    AddRemoveInsights,
}

export interface DashboardMenuProps {
    innerRef: React.Ref<HTMLButtonElement>
    subjects?: SupportedInsightSubject[]
    dashboard?: InsightDashboard
    onSelect?: (action: DashboardMenuAction) => void
    tooltipText?: string
}

const ButtonMenuItem: React.FunctionComponent<MenuItemProps> = props => <MenuItem as="button" {...props} />

export const DashboardMenu: React.FunctionComponent<DashboardMenuProps> = props => {
    const { innerRef, dashboard, subjects, onSelect = () => {}, tooltipText } = props

    const hasDashboard = dashboard !== undefined
    const permissions = useDashboardPermissions(dashboard, subjects)

    return (
        <Menu>
            <Button
                ref={innerRef}
                data-tooltip={tooltipText}
                data-placement="right"
                className={styles.triggerButton}
                variant="icon"
                as={MenuButton}
            >
                <DotsVerticalIcon size={16} />
            </Button>

            <MenuPopover portal={true} position={positionBottomRight}>
                <MenuItems className={classNames(styles.menuList, 'dropdown-menu')}>
                    <Button
                        disabled={!permissions.isConfigurable}
                        data-tooltip={getTooltipMessage(dashboard, permissions)}
                        data-placement="right"
                        className={styles.menuItem}
                        onSelect={() => onSelect(DashboardMenuAction.AddRemoveInsights)}
                        outline={true}
                        as={ButtonMenuItem}
                    >
                        Add or remove insights
                    </Button>

                    <Button
                        disabled={!permissions.isConfigurable}
                        data-tooltip={getTooltipMessage(dashboard, permissions)}
                        data-placement="right"
                        className={styles.menuItem}
                        onSelect={() => onSelect(DashboardMenuAction.Configure)}
                        outline={true}
                        as={ButtonMenuItem}
                    >
                        Configure dashboard
                    </Button>

                    <Button
                        disabled={!hasDashboard}
                        className={styles.menuItem}
                        onSelect={() => onSelect(DashboardMenuAction.CopyLink)}
                        outline={true}
                        as={ButtonMenuItem}
                    >
                        Copy link
                    </Button>

                    <hr />

                    <Button
                        disabled={!permissions.isConfigurable}
                        data-tooltip={getTooltipMessage(dashboard, permissions)}
                        data-placement="right"
                        className={classNames(styles.menuItem, styles.menuItemDanger)}
                        onSelect={() => onSelect(DashboardMenuAction.Delete)}
                        outline={true}
                        as={ButtonMenuItem}
                    >
                        Delete
                    </Button>
                </MenuItems>
            </MenuPopover>
        </Menu>
    )
}

import cytoscape from 'cytoscape'
// @ts-ignore
import cola from 'cytoscape-cola'
import React, { useEffect, useMemo, useRef } from 'react'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { dataOrThrowErrors } from '@sourcegraph/shared/src/graphql/graphql'
import * as GQL from '@sourcegraph/shared/src/graphql/schema'
import { useObservable } from '@sourcegraph/shared/src/util/useObservable'

import { BrowserPlatformContext } from '../../platform/context'

cytoscape.use(cola)

function getDependencyGraph(
    requestGraphQL: BrowserPlatformContext['requestGraphQL'],
    repo: string,
    revision: string
): Observable<GQL.IHack[] | undefined> {
    return requestGraphQL<GQL.IQuery>({
        request: `query Hack($repo: String!, $revision: String!) {
        repository(name: $repo) {
            commit(rev: $revision) {
                hack {
                    key
                    values
              }
            }
        }
    }
    `,
        variables: { repo, revision },
        mightContainPrivateInfo: false,
    }).pipe(
        map(dataOrThrowErrors),
        map(({ repository }) => repository?.commit?.hack)
    )
}

interface FileTree {
    [key: string]: string[] | FileTree
}

function getCollapsedFileTree(files: string[]): FileTree | null {
    const roots: { [key: string]: string[] } = {}

    for (const file of files) {
        const fileSplit = file.split('/')

        const root = fileSplit.length === 1 ? '' : fileSplit[0]
        if (!roots[root]) {
            roots[root] = []
        }
        roots[root].push(root ? file.slice(root.length + 1) : file)
    }

    const rootKeys = Object.keys(roots)
    if (rootKeys.length === 1 && rootKeys[0] === '') {
        return null
    }

    const fileTree: FileTree = { ...roots }
    for (const root of Object.keys(roots)) {
        const tree = getCollapsedFileTree(roots[root])
        if (!tree) {
            continue
        }
        const treeKeys = Object.keys(tree)
        // Collapse node with single folder
        if (treeKeys.length === 1) {
            delete fileTree[root]
            fileTree[root ? `${root}/${treeKeys[0]}` : treeKeys[0]] = tree[treeKeys[0]]
        } else {
            fileTree[root] = tree
        }
    }

    return fileTree
}

function treeToGraphNodes(tree: FileTree): { parent?: string; label: string; id: string; isFile?: boolean }[] {
    const nodes: { parent?: string; label: string; id: string; isFile?: boolean }[] = []
    function traverse(tree: FileTree, parent?: string): void {
        const folders = Object.keys(tree)

        for (const folder of folders) {
            const id = parent ? parent + (folder ? '/' + folder : '') : folder
            nodes.push({ parent, id, label: folder })

            const filesOrTree = tree[folder]
            if (Array.isArray(filesOrTree)) {
                for (const file of filesOrTree) {
                    nodes.push({ parent: id, id: id + '/' + file, label: file, isFile: true })
                }
            } else {
                traverse(filesOrTree, id)
            }
        }
    }
    traverse(tree)
    return nodes
}

interface DependencyGraphProps {
    repo: string
    revision: string
    requestGraphQL: BrowserPlatformContext['requestGraphQL']
}

export const DependencyGraph: React.FunctionComponent<DependencyGraphProps> = ({ repo, revision, requestGraphQL }) => {
    const hack = useObservable(
        useMemo(() => getDependencyGraph(requestGraphQL, repo, revision), [repo, revision, requestGraphQL])
    )
    const container = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (container.current && hack) {
            const uniqueNodes = new Set<string>()
            for (const node of hack) {
                uniqueNodes.add(node.key)
                for (const value of node.values) {
                    uniqueNodes.add(value)
                }
            }
            const tree = getCollapsedFileTree([...uniqueNodes])
            if (!tree) {
                return
            }
            const graphNodes = treeToGraphNodes(tree)

            const graph = cytoscape({
                container: container.current,

                elements: [
                    // ...hack.map(({ key }) => ({ data: { id: key } })),
                    ...graphNodes.map(node => ({ data: node })),
                    ...hack.flatMap(({ key, values }) =>
                        values.map(value => ({ data: { id: `${key}-${value}`, source: key, target: value } }))
                    ),
                ],

                style: [
                    // the stylesheet for the graph
                    {
                        selector: 'node',
                        style: {
                            'background-color': (element): string => (element.data('isFile') ? '#444' : '#fff'),
                            label: 'data(label)',
                        },
                    },

                    {
                        selector: 'edge',
                        style: {
                            width: 3,
                            'line-color': '#ccc',
                            'line-opacity': 0.3,
                            'target-arrow-color': '#ccc',
                            'target-arrow-shape': 'triangle',
                            'curve-style': 'bezier',
                        },
                    },
                ],
            })

            // @ts-ignore
            const layout = graph.layout({ name: 'cola', nodeDimensionsIncludeLabels: true })
            layout.run()

            graph.on('click', 'node', event => {
                if (!event.target.data('isFile')) {
                    return
                }
                const file = event.target.data('id') as string
                const ghFiles = document.querySelectorAll<HTMLDivElement>('.file-header')
                const ghFile = [...ghFiles].find(element => element.dataset.path?.includes(file))
                if (ghFile) {
                    ghFile.scrollIntoView()
                }
            })
        }
    }, [container, hack])

    return (
        // eslint-disable-next-line react/forbid-dom-props
        <div ref={container} style={{ width: '100%', height: '500px' }} />
    )
}

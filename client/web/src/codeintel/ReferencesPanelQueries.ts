import { gql } from '@sourcegraph/http-client'

const codeIntelFragments = gql`
    fragment LocationFields on Location {
        url
        resource {
            ...GitBlobFields
        }
        range {
            ...RangeFields
        }
    }

    fragment LocationConnectionFields on LocationConnection {
        nodes {
            ...LocationFields
        }
        pageInfo {
            endCursor
        }
    }

    fragment GitBlobFields on CodeIntelGitBlob {
        path
        content
        repository {
            name
        }
        commit {
            oid
        }
    }

    fragment RangeFields on Range {
        start {
            line
            character
        }
        end {
            line
            character
        }
    }
`

export const USE_PRECISE_CODE_INTEL_FOR_POSITION_QUERY = gql`
    query UsePreciseCodeIntelForPosition(
        $repository: String!
        $commit: String!
        $path: String!
    ) {
        repository(name: $repository) {
            id
            commit(rev: $commit) {
                id
                blob(path: $path) {
                    name
                }
            }
        }
    }
`

export const LOAD_ADDITIONAL_REFERENCES_QUERY = gql`
    query LoadAdditionalReferences(
        $repository: String!
        $commit: String!
        $path: String!
    ) {
        repository(name: $repository) {
            id
            commit(rev: $commit) {
                id
                blob(path: $path) {
                    name
                }
            }
        }
    }
`

export const LOAD_ADDITIONAL_IMPLEMENTATIONS_QUERY = gql`
    ${codeIntelFragments}

    query LoadAdditionalImplementations(
        $repository: String!
        $commit: String!
        $path: String!
    ) {
        repository(name: $repository) {
            id
            commit(rev: $commit) {
                id
                blob(path: $path) {
                    name
                }
            }
        }
    }
`

export const FETCH_HIGHLIGHTED_BLOB = gql`
    fragment HighlightedGitBlobFields on GitBlob {
        highlight(disableTimeout: false, format: $format) {
            aborted
            html @include(if: $html)
            lsif
        }
    }

    query ReferencesPanelHighlightedBlob(
        $repository: String!
        $commit: String!
        $path: String!
        $format: HighlightResponseFormat!
        $html: Boolean!
    ) {
        repository(name: $repository) {
            id
            commit(rev: $commit) {
                id
                blob(path: $path) {
                    ...HighlightedGitBlobFields
                    content
                }
            }
        }
    }
`

export const CODE_INTEL_SEARCH_QUERY = gql`
    query CodeIntelSearch2($query: String!) {
        search(query: $query) {
            __typename
            results {
                __typename
                results {
                    ... on FileMatch {
                        __typename
                        file {
                            url
                            path
                            commit {
                                oid
                            }
                            content
                        }
                        repository {
                            id
                            name
                        }
                        symbols {
                            name
                            kind
                            location {
                                url
                                resource {
                                    path
                                }
                                range {
                                    start {
                                        line
                                        character
                                    }
                                    end {
                                        line
                                        character
                                    }
                                }
                            }
                            fileLocal
                        }
                        lineMatches {
                            lineNumber
                            offsetAndLengths
                        }
                    }
                }
            }
        }
    }
`

export const LOCAL_CODE_INTEL_QUERY = gql`
    query LocalCodeIntel($repository: String!, $commit: String!, $path: String!) {
        repository(name: $repository) {
            id
            commit(rev: $commit) {
                blob(path: $path) {
                    name
                }
            }
        }
    }
`

export const RESOLVE_REPO_REVISION_BLOB_QUERY = gql`
    fragment RepoRevisionBlobFields on Repository {
        id
        name
        url

        isFork
        isArchived

        commit(rev: $revision) {
            oid

            file(path: $filePath) {
                content
            }
        }

        defaultBranch {
            abbrevName
        }
    }

    query ResolveRepoAndRevision($repoName: String!, $revision: String!, $filePath: String!) {
        repositoryRedirect(name: $repoName) {
            __typename
            ... on Repository {
                ...RepoRevisionBlobFields
            }
            ... on Redirect {
                url
            }
        }
    }
`

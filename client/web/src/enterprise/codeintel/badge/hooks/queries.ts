import { gql } from '@sourcegraph/http-client'

import { lsifIndexFieldsFragment } from '../../indexes/hooks/types'
import { lsifUploadFieldsFragment } from '../../uploads/hooks/types'

export const codeIntelStatusQuery = gql`
    query CodeIntelStatus($repository: String!, $commit: String!, $path: String!) {
        repository(name: $repository) {
            
            commit(rev: $commit) {
                path(path: $path) {
                    __typename
                }
            }
        }
    }

`

export const requestedLanguageSupportQuery = gql`
    query RequestedLanguageSupport {
        requestedLanguageSupport
    }
`

export const requestLanguageSupportQuery = gql`
    mutation RequestLanguageSupport($language: String!) {
        requestLanguageSupport(language: $language) {
            alwaysNil
        }
    }
`

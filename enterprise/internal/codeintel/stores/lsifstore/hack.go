package lsifstore

import (
	"context"

	"github.com/keegancsmith/sqlf"

	"github.com/sourcegraph/sourcegraph/lib/codeintel/precise"
)

type stringSet map[string]struct{}

// Hack returns a map from paths to set of paths such that all keys contain definitions to each of their values.
// Definitions to paths not present in the given map are ignored. This method does not link results between the
// given bundles and moniker search paths must be called explicitly.
func (s *Store) Hack(ctx context.Context, changedPathsByBundles map[int][]string) (definitionsByPath map[string][]string, err error) {
	pathSet := stringSet{}
	for _, paths := range changedPathsByBundles {
		for _, path := range paths {
			pathSet[path] = struct{}{}
		}
	}

	definitionSetByPath := map[string]stringSet{}
	for bundleID, paths := range changedPathsByBundles {
		for _, path := range paths {
			documentData, exists, err := s.scanFirstDocumentData(s.Store.Query(ctx, sqlf.Sprintf(rangesDocumentQuery, bundleID, path)))
			if err != nil || !exists {
				// TODO: Why does this happen?
				continue
			}

			ranges := make([]precise.RangeData, 0, len(documentData.Document.Ranges))
			for _, rs := range documentData.Document.Ranges {
				ranges = append(ranges, rs)
			}

			definitionResultIDs := extractResultIDs(ranges, func(r precise.RangeData) precise.ID { return r.DefinitionResultID })
			definitionLocations, _, err := s.locations(ctx, bundleID, definitionResultIDs, 100000, 0)
			if err != nil {
				return nil, err
			}

			for _, locations := range definitionLocations {
				for _, location := range locations {
					if _, ok := pathSet[location.Path]; ok {
						if _, ok := definitionSetByPath[path]; !ok {
							definitionSetByPath[path] = stringSet{}
						}

						definitionSetByPath[path][location.Path] = struct{}{}
					}
				}
			}
		}
	}

	definitionsByPath = make(map[string][]string, len(definitionSetByPath))
	for from, set := range definitionSetByPath {
		to := make([]string, 0, len(set))
		for v := range set {
			to = append(to, v)
		}

		definitionsByPath[from] = to
	}

	return definitionsByPath, nil
}

package lsifstore

import (
	"context"

	"github.com/keegancsmith/sqlf"

	"github.com/sourcegraph/sourcegraph/lib/codeintel/precise"
)

type stringSet map[string]struct{}

// Hack returns a map from paths to set of paths such that all keys contain references to each of their values.
// References to paths not present in the given map are ignored. This method does not link results between the
// given bundles and moniker search paths must be called explicitly.
func (s *Store) Hack(ctx context.Context, changedPathsByBundles map[int][]string) (referencesByPath map[string][]string, err error) {
	pathSet := stringSet{}
	for _, paths := range changedPathsByBundles {
		for _, path := range paths {
			pathSet[path] = struct{}{}
		}
	}

	referenceSetByPath := map[string]stringSet{}
	for bundleID, paths := range changedPathsByBundles {
		for _, path := range paths {
			documentData, exists, err := s.scanFirstDocumentData(s.Store.Query(ctx, sqlf.Sprintf(rangesDocumentQuery, bundleID, path)))
			if err != nil || !exists {
				return nil, err
			}

			ranges := make([]precise.RangeData, 0, len(documentData.Document.Ranges))
			for _, rs := range documentData.Document.Ranges {
				ranges = append(ranges, rs)
			}

			referenceResultIDs := extractResultIDs(ranges, func(r precise.RangeData) precise.ID { return r.ReferenceResultID })
			referenceLocations, _, err := s.locations(ctx, bundleID, referenceResultIDs, 100000, 0)
			if err != nil {
				return nil, err
			}

			for _, locations := range referenceLocations {
				for _, location := range locations {
					if _, ok := pathSet[location.Path]; ok {
						if _, ok := referenceSetByPath[path]; !ok {
							referenceSetByPath[path] = stringSet{}
						}

						referenceSetByPath[path][location.Path] = struct{}{}
					}
				}
			}
		}
	}

	referencesByPath = make(map[string][]string, len(referenceSetByPath))
	for from, set := range referenceSetByPath {
		to := make([]string, 0, len(set))
		for v := range set {
			to = append(to, v)
		}

		referencesByPath[from] = to
	}

	return referencesByPath, nil
}

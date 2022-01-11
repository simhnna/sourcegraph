package api

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/cockroachdb/errors"
	"github.com/inconshreveable/log15"

	"github.com/sourcegraph/sourcegraph/cmd/symbols/internal/types"
)

func NewHandler(
	searchFunc types.SearchFunc,
) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/search", handleSearchWith(searchFunc))
	mux.HandleFunc("/healthz", handleHealthCheck)
	return mux
}

const maxNumSymbolResults = 500

func handleSearchWith(searchFunc types.SearchFunc) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var args types.SearchArgs
		if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if args.First < 0 || args.First > maxNumSymbolResults {
			args.First = maxNumSymbolResults
		}

		result, err := searchFunc(r.Context(), args)
		if err != nil {
			// Ignore reporting errors where client disconnected
			if r.Context().Err() == context.Canceled && errors.Is(err, context.Canceled) {
				return
			}

			log15.Error("Symbol search failed", "args", args, "error", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := json.NewEncoder(w).Encode(result); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)

	if _, err := w.Write([]byte("OK")); err != nil {
		log15.Error("failed to write response to health check, err: %s", err)
	}
}

package httpauth

import (
	"net/http"

	"github.com/inconshreveable/log15"

	"github.com/sourcegraph/sourcegraph/cmd/frontend/auth"
	"github.com/sourcegraph/sourcegraph/internal/actor"
	"github.com/sourcegraph/sourcegraph/internal/database"
	"github.com/sourcegraph/sourcegraph/internal/extsvc"
)

const usernameHeader = "X-Forwarded-User"
const emailHeader = "X-Forwarded-Email"

func Init(db database.DB) {
	f := middleware(db)
	auth.RegisterMiddlewares(
		&auth.Middleware{
			API: f,
			App: f,
		},
	)
}

func middleware(db database.DB) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			rawEmail := r.Header.Get(emailHeader)
			if rawEmail == "" || actor.FromContext(r.Context()).IsAuthenticated() {
				next.ServeHTTP(w, r)
				return
			}
			username, err := auth.NormalizeUsername(rawEmail)
			if err != nil {
				log15.Error("unable to normalize username", "emailHeader", rawEmail, "err", err)
				username = "unknown"
			}
			userId, safeErrorMessage, err := auth.GetAndSaveUser(r.Context(), db, auth.GetAndSaveUserOp{
				CreateIfNotExist: true,
				UserProps: database.NewUser{
					Email:           rawEmail,
					Username:        username,
					DisplayName:     username,
					EmailIsVerified: true,
				},
				ExternalAccount: extsvc.AccountSpec{
					ServiceType: "xhttpauth",
					AccountID:   rawEmail,
				},
				LookUpByUsername: false,
			})
			if err != nil {
				log15.Error("unable to get/create user from HTTP Header", "emailHeader", rawEmail, "err", err, "userErr", safeErrorMessage)
				http.Error(w, safeErrorMessage, http.StatusInternalServerError)
				return
			}
			next.ServeHTTP(w, r.WithContext(actor.WithActor(r.Context(), &actor.Actor{UID: userId})))
		})
	}
}

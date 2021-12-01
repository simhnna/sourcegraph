package database

import (
	"context"
	"reflect"
	"strconv"
	"testing"

	"github.com/google/go-cmp/cmp"

	"github.com/sourcegraph/sourcegraph/internal/api"
	"github.com/sourcegraph/sourcegraph/internal/database/dbtest"
	"github.com/sourcegraph/sourcegraph/internal/types"
)

func TestSavedSearchesIsEmpty(t *testing.T) {
	t.Parallel()
	tx := dbtest.NewFastTx(t)
	ctx := context.Background()
	isEmpty, err := SavedSearches(tx).IsEmpty(ctx)
	if err != nil {
		t.Fatal()
	}
	want := true
	if want != isEmpty {
		t.Errorf("want %v, got %v", want, isEmpty)
	}

	user, err := Users(tx).Create(ctx, NewUser{DisplayName: "test", Email: "test@test.com", Username: "test", Password: "test", EmailVerificationCode: "c2"})
	if err != nil {
		t.Fatal("can't create user", err)
	}
	fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	_, err = SavedSearches(tx).Create(ctx, fake)
	if err != nil {
		t.Fatal(err)
	}

	isEmpty, err = SavedSearches(tx).IsEmpty(ctx)
	if err != nil {
		t.Fatal(err)
	}
	want = false
	if want != isEmpty {
		t.Errorf("want %v, got %v", want, isEmpty)
	}
}

func TestSavedSearchesCreate(t *testing.T) {
	t.Parallel()
	tx := dbtest.NewFastTx(t)
	ctx := context.Background()
	user, err := Users(tx).Create(ctx, NewUser{DisplayName: "test", Email: "test@test.com", Username: "test", Password: "test", EmailVerificationCode: "c2"})
	if err != nil {
		t.Fatal("can't create user", err)
	}
	fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	ss, err := SavedSearches(tx).Create(ctx, fake)
	if err != nil {
		t.Fatal(err)
	}
	if ss == nil {
		t.Fatalf("no saved search returned, create failed")
	}

	want := &types.SavedSearch{
		ID:          ss.ID,
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	if !reflect.DeepEqual(ss, want) {
		t.Errorf("query is '%v', want '%v'", ss, want)
	}
}

func TestSavedSearchesUpdate(t *testing.T) {
	t.Parallel()
	tx := dbtest.NewFastTx(t)
	ctx := context.Background()
	user, err := Users(tx).Create(ctx, NewUser{DisplayName: "test", Email: "test@test.com", Username: "test", Password: "test", EmailVerificationCode: "c2"})
	if err != nil {
		t.Fatal("can't create user", err)
	}
	fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	ss1, err := SavedSearches(tx).Create(ctx, fake)
	if err != nil {
		t.Fatal(err)
	}

	updated := &types.SavedSearch{
		ID:          ss1.ID,
		Query:       "test2",
		Description: "test2",
		UserID:      &user.ID,
		OrgID:       nil,
	}

	updatedSearch, err := SavedSearches(tx).Update(ctx, updated)
	if err != nil {
		t.Fatal(err)
	}

	if !reflect.DeepEqual(updatedSearch, updated) {
		t.Errorf("updatedSearch is %v, want %v", updatedSearch, updated)
	}
}

func TestSavedSearchesDelete(t *testing.T) {
	t.Parallel()
	tx := dbtest.NewFastTx(t)
	ctx := context.Background()
	user, err := Users(tx).Create(ctx, NewUser{DisplayName: "test", Email: "test@test.com", Username: "test", Password: "test", EmailVerificationCode: "c2"})
	if err != nil {
		t.Fatal("can't create user", err)
	}
	fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	ss, err := SavedSearches(tx).Create(ctx, fake)
	if err != nil {
		t.Fatal(err)
	}

	err = SavedSearches(tx).Delete(ctx, ss.ID)
	if err != nil {
		t.Fatal(err)
	}

	allQueries, err := SavedSearches(tx).ListAll(ctx)
	if err != nil {
		t.Fatal(err)
	}

	if len(allQueries) > 0 {
		t.Error("expected no queries in saved_searches table")
	}
}

func TestSavedSearchesGetByUserID(t *testing.T) {
	t.Parallel()
	tx := dbtest.NewFastTx(t)
	ctx := context.Background()
	user, err := Users(tx).Create(ctx, NewUser{DisplayName: "test", Email: "test@test.com", Username: "test", Password: "test", EmailVerificationCode: "c2"})
	if err != nil {
		t.Fatal("can't create user", err)
	}
	fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	ss, err := SavedSearches(tx).Create(ctx, fake)
	if err != nil {
		t.Fatal(err)
	}

	if ss == nil {
		t.Fatalf("no saved search returned, create failed")
	}
	savedSearch, err := SavedSearches(tx).ListSavedSearchesByUserID(ctx, user.ID)
	if err != nil {
		t.Fatal(err)
	}
	want := []*types.SavedSearch{{
		ID:          ss.ID,
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}}
	if !reflect.DeepEqual(savedSearch, want) {
		t.Errorf("query is '%v+', want '%v+'", savedSearch, want)
	}
}

func TestSavedSearchesGetByID(t *testing.T) {
	t.Parallel()
	tx := dbtest.NewFastTx(t)
	ctx := context.Background()
	user, err := Users(tx).Create(ctx, NewUser{DisplayName: "test", Email: "test@test.com", Username: "test", Password: "test", EmailVerificationCode: "c2"})
	if err != nil {
		t.Fatal("can't create user", err)
	}
	fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	ss, err := SavedSearches(tx).Create(ctx, fake)
	if err != nil {
		t.Fatal(err)
	}

	if ss == nil {
		t.Fatalf("no saved search returned, create failed")
	}
	savedSearch, err := SavedSearches(tx).GetByID(ctx, ss.ID)
	if err != nil {
		t.Fatal(err)
	}
	want := &api.SavedQuerySpecAndConfig{
		Spec: api.SavedQueryIDSpec{
			Subject: api.SettingsSubject{User: &user.ID},
			Key:     strconv.Itoa(int(ss.ID)),
		},
		Config: api.ConfigSavedQuery{
			Key:         strconv.Itoa(int(ss.ID)),
			Query:       "test",
			Description: "test",
			UserID:      &user.ID,
			OrgID:       nil,
		},
	}

	if diff := cmp.Diff(want, savedSearch); diff != "" {
		t.Fatalf("Mismatch (-want +got):\n%s", diff)
	}
}

func TestListSavedSearchesByUserID(t *testing.T) {
	t.Parallel()
	tx := dbtest.NewFastTx(t)
	ctx := context.Background()
	user, err := Users(tx).Create(ctx, NewUser{DisplayName: "test", Email: "test@test.com", Username: "test", Password: "test", EmailVerificationCode: "c2"})
	if err != nil {
		t.Fatal("can't create user", err)
	}
	fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}
	ss, err := SavedSearches(tx).Create(ctx, fake)
	if err != nil {
		t.Fatal(err)
	}

	if ss == nil {
		t.Fatalf("no saved search returned, create failed")
	}

	org1, err := Orgs(tx).Create(ctx, "org1", nil)
	if err != nil {
		t.Fatal("can't create org1", err)
	}
	org2, err := Orgs(tx).Create(ctx, "org2", nil)
	if err != nil {
		t.Fatal("can't create org2", err)
	}

	orgFake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      nil,
		OrgID:       &org1.ID,
	}
	orgSearch, err := SavedSearches(tx).Create(ctx, orgFake)
	if err != nil {
		t.Fatal(err)
	}
	if orgSearch == nil {
		t.Fatalf("no saved search returned, org saved search create failed")
	}

	org2Fake := &types.SavedSearch{
		Query:       "test",
		Description: "test",
		UserID:      nil,
		OrgID:       &org2.ID,
	}
	org2Search, err := SavedSearches(tx).Create(ctx, org2Fake)
	if err != nil {
		t.Fatal(err)
	}
	if org2Search == nil {
		t.Fatalf("no saved search returned, org2 saved search create failed")
	}

	_, err = OrgMembers(tx).Create(ctx, org1.ID, user.ID)
	if err != nil {
		t.Fatal(err)
	}
	_, err = OrgMembers(tx).Create(ctx, org2.ID, user.ID)
	if err != nil {
		t.Fatal(err)
	}

	savedSearches, err := SavedSearches(tx).ListSavedSearchesByUserID(ctx, user.ID)
	if err != nil {
		t.Fatal(err)
	}

	want := []*types.SavedSearch{{
		ID:          ss.ID,
		Query:       "test",
		Description: "test",
		UserID:      &user.ID,
		OrgID:       nil,
	}, {
		ID:          orgSearch.ID,
		Query:       "test",
		Description: "test",
		UserID:      nil,
		OrgID:       &org1.ID,
	}, {
		ID:          org2Search.ID,
		Query:       "test",
		Description: "test",
		UserID:      nil,
		OrgID:       &org2.ID,
	}}

	if !reflect.DeepEqual(savedSearches, want) {
		t.Errorf("got %v, want %v", savedSearches, want)
	}
}

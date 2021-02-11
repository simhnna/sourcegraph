// Code generated by github.com/efritz/go-mockgen 0.1.0; DO NOT EDIT.

package httpapi

import (
	"context"
	dbstore "github.com/sourcegraph/sourcegraph/enterprise/internal/codeintel/stores/dbstore"
	"sync"
)

// MockDBStore is a mock implementation of the DBStore interface (from the
// package
// github.com/sourcegraph/sourcegraph/enterprise/cmd/frontend/internal/codeintel/httpapi)
// used for unit testing.
type MockDBStore struct {
	// AddUploadPartFunc is an instance of a mock function object
	// controlling the behavior of the method AddUploadPart.
	AddUploadPartFunc *DBStoreAddUploadPartFunc
	// DoneFunc is an instance of a mock function object controlling the
	// behavior of the method Done.
	DoneFunc *DBStoreDoneFunc
	// GetUploadByIDFunc is an instance of a mock function object
	// controlling the behavior of the method GetUploadByID.
	GetUploadByIDFunc *DBStoreGetUploadByIDFunc
	// InsertUploadFunc is an instance of a mock function object controlling
	// the behavior of the method InsertUpload.
	InsertUploadFunc *DBStoreInsertUploadFunc
	// MarkQueuedFunc is an instance of a mock function object controlling
	// the behavior of the method MarkQueued.
	MarkQueuedFunc *DBStoreMarkQueuedFunc
	// TransactFunc is an instance of a mock function object controlling the
	// behavior of the method Transact.
	TransactFunc *DBStoreTransactFunc
}

// NewMockDBStore creates a new mock of the DBStore interface. All methods
// return zero values for all results, unless overwritten.
func NewMockDBStore() *MockDBStore {
	return &MockDBStore{
		AddUploadPartFunc: &DBStoreAddUploadPartFunc{
			defaultHook: func(context.Context, int, int) error {
				return nil
			},
		},
		DoneFunc: &DBStoreDoneFunc{
			defaultHook: func(error) error {
				return nil
			},
		},
		GetUploadByIDFunc: &DBStoreGetUploadByIDFunc{
			defaultHook: func(context.Context, int) (dbstore.Upload, bool, error) {
				return dbstore.Upload{}, false, nil
			},
		},
		InsertUploadFunc: &DBStoreInsertUploadFunc{
			defaultHook: func(context.Context, dbstore.Upload) (int, error) {
				return 0, nil
			},
		},
		MarkQueuedFunc: &DBStoreMarkQueuedFunc{
			defaultHook: func(context.Context, int, *int64) error {
				return nil
			},
		},
		TransactFunc: &DBStoreTransactFunc{
			defaultHook: func(context.Context) (DBStore, error) {
				return nil, nil
			},
		},
	}
}

// NewMockDBStoreFrom creates a new mock of the MockDBStore interface. All
// methods delegate to the given implementation, unless overwritten.
func NewMockDBStoreFrom(i DBStore) *MockDBStore {
	return &MockDBStore{
		AddUploadPartFunc: &DBStoreAddUploadPartFunc{
			defaultHook: i.AddUploadPart,
		},
		DoneFunc: &DBStoreDoneFunc{
			defaultHook: i.Done,
		},
		GetUploadByIDFunc: &DBStoreGetUploadByIDFunc{
			defaultHook: i.GetUploadByID,
		},
		InsertUploadFunc: &DBStoreInsertUploadFunc{
			defaultHook: i.InsertUpload,
		},
		MarkQueuedFunc: &DBStoreMarkQueuedFunc{
			defaultHook: i.MarkQueued,
		},
		TransactFunc: &DBStoreTransactFunc{
			defaultHook: i.Transact,
		},
	}
}

// DBStoreAddUploadPartFunc describes the behavior when the AddUploadPart
// method of the parent MockDBStore instance is invoked.
type DBStoreAddUploadPartFunc struct {
	defaultHook func(context.Context, int, int) error
	hooks       []func(context.Context, int, int) error
	history     []DBStoreAddUploadPartFuncCall
	mutex       sync.Mutex
}

// AddUploadPart delegates to the next hook function in the queue and stores
// the parameter and result values of this invocation.
func (m *MockDBStore) AddUploadPart(v0 context.Context, v1 int, v2 int) error {
	r0 := m.AddUploadPartFunc.nextHook()(v0, v1, v2)
	m.AddUploadPartFunc.appendCall(DBStoreAddUploadPartFuncCall{v0, v1, v2, r0})
	return r0
}

// SetDefaultHook sets function that is called when the AddUploadPart method
// of the parent MockDBStore instance is invoked and the hook queue is
// empty.
func (f *DBStoreAddUploadPartFunc) SetDefaultHook(hook func(context.Context, int, int) error) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// AddUploadPart method of the parent MockDBStore instance invokes the hook
// at the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *DBStoreAddUploadPartFunc) PushHook(hook func(context.Context, int, int) error) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *DBStoreAddUploadPartFunc) SetDefaultReturn(r0 error) {
	f.SetDefaultHook(func(context.Context, int, int) error {
		return r0
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *DBStoreAddUploadPartFunc) PushReturn(r0 error) {
	f.PushHook(func(context.Context, int, int) error {
		return r0
	})
}

func (f *DBStoreAddUploadPartFunc) nextHook() func(context.Context, int, int) error {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *DBStoreAddUploadPartFunc) appendCall(r0 DBStoreAddUploadPartFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of DBStoreAddUploadPartFuncCall objects
// describing the invocations of this function.
func (f *DBStoreAddUploadPartFunc) History() []DBStoreAddUploadPartFuncCall {
	f.mutex.Lock()
	history := make([]DBStoreAddUploadPartFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// DBStoreAddUploadPartFuncCall is an object that describes an invocation of
// method AddUploadPart on an instance of MockDBStore.
type DBStoreAddUploadPartFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Arg1 is the value of the 2nd argument passed to this method
	// invocation.
	Arg1 int
	// Arg2 is the value of the 3rd argument passed to this method
	// invocation.
	Arg2 int
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c DBStoreAddUploadPartFuncCall) Args() []interface{} {
	return []interface{}{c.Arg0, c.Arg1, c.Arg2}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c DBStoreAddUploadPartFuncCall) Results() []interface{} {
	return []interface{}{c.Result0}
}

// DBStoreDoneFunc describes the behavior when the Done method of the parent
// MockDBStore instance is invoked.
type DBStoreDoneFunc struct {
	defaultHook func(error) error
	hooks       []func(error) error
	history     []DBStoreDoneFuncCall
	mutex       sync.Mutex
}

// Done delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockDBStore) Done(v0 error) error {
	r0 := m.DoneFunc.nextHook()(v0)
	m.DoneFunc.appendCall(DBStoreDoneFuncCall{v0, r0})
	return r0
}

// SetDefaultHook sets function that is called when the Done method of the
// parent MockDBStore instance is invoked and the hook queue is empty.
func (f *DBStoreDoneFunc) SetDefaultHook(hook func(error) error) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// Done method of the parent MockDBStore instance invokes the hook at the
// front of the queue and discards it. After the queue is empty, the default
// hook function is invoked for any future action.
func (f *DBStoreDoneFunc) PushHook(hook func(error) error) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *DBStoreDoneFunc) SetDefaultReturn(r0 error) {
	f.SetDefaultHook(func(error) error {
		return r0
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *DBStoreDoneFunc) PushReturn(r0 error) {
	f.PushHook(func(error) error {
		return r0
	})
}

func (f *DBStoreDoneFunc) nextHook() func(error) error {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *DBStoreDoneFunc) appendCall(r0 DBStoreDoneFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of DBStoreDoneFuncCall objects describing the
// invocations of this function.
func (f *DBStoreDoneFunc) History() []DBStoreDoneFuncCall {
	f.mutex.Lock()
	history := make([]DBStoreDoneFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// DBStoreDoneFuncCall is an object that describes an invocation of method
// Done on an instance of MockDBStore.
type DBStoreDoneFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 error
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c DBStoreDoneFuncCall) Args() []interface{} {
	return []interface{}{c.Arg0}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c DBStoreDoneFuncCall) Results() []interface{} {
	return []interface{}{c.Result0}
}

// DBStoreGetUploadByIDFunc describes the behavior when the GetUploadByID
// method of the parent MockDBStore instance is invoked.
type DBStoreGetUploadByIDFunc struct {
	defaultHook func(context.Context, int) (dbstore.Upload, bool, error)
	hooks       []func(context.Context, int) (dbstore.Upload, bool, error)
	history     []DBStoreGetUploadByIDFuncCall
	mutex       sync.Mutex
}

// GetUploadByID delegates to the next hook function in the queue and stores
// the parameter and result values of this invocation.
func (m *MockDBStore) GetUploadByID(v0 context.Context, v1 int) (dbstore.Upload, bool, error) {
	r0, r1, r2 := m.GetUploadByIDFunc.nextHook()(v0, v1)
	m.GetUploadByIDFunc.appendCall(DBStoreGetUploadByIDFuncCall{v0, v1, r0, r1, r2})
	return r0, r1, r2
}

// SetDefaultHook sets function that is called when the GetUploadByID method
// of the parent MockDBStore instance is invoked and the hook queue is
// empty.
func (f *DBStoreGetUploadByIDFunc) SetDefaultHook(hook func(context.Context, int) (dbstore.Upload, bool, error)) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// GetUploadByID method of the parent MockDBStore instance invokes the hook
// at the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *DBStoreGetUploadByIDFunc) PushHook(hook func(context.Context, int) (dbstore.Upload, bool, error)) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *DBStoreGetUploadByIDFunc) SetDefaultReturn(r0 dbstore.Upload, r1 bool, r2 error) {
	f.SetDefaultHook(func(context.Context, int) (dbstore.Upload, bool, error) {
		return r0, r1, r2
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *DBStoreGetUploadByIDFunc) PushReturn(r0 dbstore.Upload, r1 bool, r2 error) {
	f.PushHook(func(context.Context, int) (dbstore.Upload, bool, error) {
		return r0, r1, r2
	})
}

func (f *DBStoreGetUploadByIDFunc) nextHook() func(context.Context, int) (dbstore.Upload, bool, error) {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *DBStoreGetUploadByIDFunc) appendCall(r0 DBStoreGetUploadByIDFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of DBStoreGetUploadByIDFuncCall objects
// describing the invocations of this function.
func (f *DBStoreGetUploadByIDFunc) History() []DBStoreGetUploadByIDFuncCall {
	f.mutex.Lock()
	history := make([]DBStoreGetUploadByIDFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// DBStoreGetUploadByIDFuncCall is an object that describes an invocation of
// method GetUploadByID on an instance of MockDBStore.
type DBStoreGetUploadByIDFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Arg1 is the value of the 2nd argument passed to this method
	// invocation.
	Arg1 int
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 dbstore.Upload
	// Result1 is the value of the 2nd result returned from this method
	// invocation.
	Result1 bool
	// Result2 is the value of the 3rd result returned from this method
	// invocation.
	Result2 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c DBStoreGetUploadByIDFuncCall) Args() []interface{} {
	return []interface{}{c.Arg0, c.Arg1}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c DBStoreGetUploadByIDFuncCall) Results() []interface{} {
	return []interface{}{c.Result0, c.Result1, c.Result2}
}

// DBStoreInsertUploadFunc describes the behavior when the InsertUpload
// method of the parent MockDBStore instance is invoked.
type DBStoreInsertUploadFunc struct {
	defaultHook func(context.Context, dbstore.Upload) (int, error)
	hooks       []func(context.Context, dbstore.Upload) (int, error)
	history     []DBStoreInsertUploadFuncCall
	mutex       sync.Mutex
}

// InsertUpload delegates to the next hook function in the queue and stores
// the parameter and result values of this invocation.
func (m *MockDBStore) InsertUpload(v0 context.Context, v1 dbstore.Upload) (int, error) {
	r0, r1 := m.InsertUploadFunc.nextHook()(v0, v1)
	m.InsertUploadFunc.appendCall(DBStoreInsertUploadFuncCall{v0, v1, r0, r1})
	return r0, r1
}

// SetDefaultHook sets function that is called when the InsertUpload method
// of the parent MockDBStore instance is invoked and the hook queue is
// empty.
func (f *DBStoreInsertUploadFunc) SetDefaultHook(hook func(context.Context, dbstore.Upload) (int, error)) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// InsertUpload method of the parent MockDBStore instance invokes the hook
// at the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *DBStoreInsertUploadFunc) PushHook(hook func(context.Context, dbstore.Upload) (int, error)) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *DBStoreInsertUploadFunc) SetDefaultReturn(r0 int, r1 error) {
	f.SetDefaultHook(func(context.Context, dbstore.Upload) (int, error) {
		return r0, r1
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *DBStoreInsertUploadFunc) PushReturn(r0 int, r1 error) {
	f.PushHook(func(context.Context, dbstore.Upload) (int, error) {
		return r0, r1
	})
}

func (f *DBStoreInsertUploadFunc) nextHook() func(context.Context, dbstore.Upload) (int, error) {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *DBStoreInsertUploadFunc) appendCall(r0 DBStoreInsertUploadFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of DBStoreInsertUploadFuncCall objects
// describing the invocations of this function.
func (f *DBStoreInsertUploadFunc) History() []DBStoreInsertUploadFuncCall {
	f.mutex.Lock()
	history := make([]DBStoreInsertUploadFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// DBStoreInsertUploadFuncCall is an object that describes an invocation of
// method InsertUpload on an instance of MockDBStore.
type DBStoreInsertUploadFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Arg1 is the value of the 2nd argument passed to this method
	// invocation.
	Arg1 dbstore.Upload
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 int
	// Result1 is the value of the 2nd result returned from this method
	// invocation.
	Result1 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c DBStoreInsertUploadFuncCall) Args() []interface{} {
	return []interface{}{c.Arg0, c.Arg1}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c DBStoreInsertUploadFuncCall) Results() []interface{} {
	return []interface{}{c.Result0, c.Result1}
}

// DBStoreMarkQueuedFunc describes the behavior when the MarkQueued method
// of the parent MockDBStore instance is invoked.
type DBStoreMarkQueuedFunc struct {
	defaultHook func(context.Context, int, *int64) error
	hooks       []func(context.Context, int, *int64) error
	history     []DBStoreMarkQueuedFuncCall
	mutex       sync.Mutex
}

// MarkQueued delegates to the next hook function in the queue and stores
// the parameter and result values of this invocation.
func (m *MockDBStore) MarkQueued(v0 context.Context, v1 int, v2 *int64) error {
	r0 := m.MarkQueuedFunc.nextHook()(v0, v1, v2)
	m.MarkQueuedFunc.appendCall(DBStoreMarkQueuedFuncCall{v0, v1, v2, r0})
	return r0
}

// SetDefaultHook sets function that is called when the MarkQueued method of
// the parent MockDBStore instance is invoked and the hook queue is empty.
func (f *DBStoreMarkQueuedFunc) SetDefaultHook(hook func(context.Context, int, *int64) error) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// MarkQueued method of the parent MockDBStore instance invokes the hook at
// the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *DBStoreMarkQueuedFunc) PushHook(hook func(context.Context, int, *int64) error) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *DBStoreMarkQueuedFunc) SetDefaultReturn(r0 error) {
	f.SetDefaultHook(func(context.Context, int, *int64) error {
		return r0
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *DBStoreMarkQueuedFunc) PushReturn(r0 error) {
	f.PushHook(func(context.Context, int, *int64) error {
		return r0
	})
}

func (f *DBStoreMarkQueuedFunc) nextHook() func(context.Context, int, *int64) error {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *DBStoreMarkQueuedFunc) appendCall(r0 DBStoreMarkQueuedFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of DBStoreMarkQueuedFuncCall objects
// describing the invocations of this function.
func (f *DBStoreMarkQueuedFunc) History() []DBStoreMarkQueuedFuncCall {
	f.mutex.Lock()
	history := make([]DBStoreMarkQueuedFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// DBStoreMarkQueuedFuncCall is an object that describes an invocation of
// method MarkQueued on an instance of MockDBStore.
type DBStoreMarkQueuedFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Arg1 is the value of the 2nd argument passed to this method
	// invocation.
	Arg1 int
	// Arg2 is the value of the 3rd argument passed to this method
	// invocation.
	Arg2 *int64
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c DBStoreMarkQueuedFuncCall) Args() []interface{} {
	return []interface{}{c.Arg0, c.Arg1, c.Arg2}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c DBStoreMarkQueuedFuncCall) Results() []interface{} {
	return []interface{}{c.Result0}
}

// DBStoreTransactFunc describes the behavior when the Transact method of
// the parent MockDBStore instance is invoked.
type DBStoreTransactFunc struct {
	defaultHook func(context.Context) (DBStore, error)
	hooks       []func(context.Context) (DBStore, error)
	history     []DBStoreTransactFuncCall
	mutex       sync.Mutex
}

// Transact delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockDBStore) Transact(v0 context.Context) (DBStore, error) {
	r0, r1 := m.TransactFunc.nextHook()(v0)
	m.TransactFunc.appendCall(DBStoreTransactFuncCall{v0, r0, r1})
	return r0, r1
}

// SetDefaultHook sets function that is called when the Transact method of
// the parent MockDBStore instance is invoked and the hook queue is empty.
func (f *DBStoreTransactFunc) SetDefaultHook(hook func(context.Context) (DBStore, error)) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// Transact method of the parent MockDBStore instance invokes the hook at
// the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *DBStoreTransactFunc) PushHook(hook func(context.Context) (DBStore, error)) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *DBStoreTransactFunc) SetDefaultReturn(r0 DBStore, r1 error) {
	f.SetDefaultHook(func(context.Context) (DBStore, error) {
		return r0, r1
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *DBStoreTransactFunc) PushReturn(r0 DBStore, r1 error) {
	f.PushHook(func(context.Context) (DBStore, error) {
		return r0, r1
	})
}

func (f *DBStoreTransactFunc) nextHook() func(context.Context) (DBStore, error) {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *DBStoreTransactFunc) appendCall(r0 DBStoreTransactFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of DBStoreTransactFuncCall objects describing
// the invocations of this function.
func (f *DBStoreTransactFunc) History() []DBStoreTransactFuncCall {
	f.mutex.Lock()
	history := make([]DBStoreTransactFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// DBStoreTransactFuncCall is an object that describes an invocation of
// method Transact on an instance of MockDBStore.
type DBStoreTransactFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 DBStore
	// Result1 is the value of the 2nd result returned from this method
	// invocation.
	Result1 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c DBStoreTransactFuncCall) Args() []interface{} {
	return []interface{}{c.Arg0}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c DBStoreTransactFuncCall) Results() []interface{} {
	return []interface{}{c.Result0, c.Result1}
}

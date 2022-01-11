package main

import (
	"os"
	"runtime"
	"strconv"

	"github.com/sourcegraph/sourcegraph/cmd/symbols/internal/types"
	"github.com/sourcegraph/sourcegraph/internal/env"
)

type Config struct {
	env.BaseConfig

	ctags types.CtagsConfig

	sanityCheck       bool
	cacheDir          string
	cacheSizeMB       int
	numCtagsProcesses int
	requestBufferSize int
	useRockskip       bool
}

var config = &Config{}

// Load reads from the environment and stores the transformed data on the config object for later retrieval.
func (c *Config) Load() {
	c.ctags.Command = c.Get("CTAGS_COMMAND", "universal-ctags", "ctags command (should point to universal-ctags executable compiled with JSON and seccomp support)")
	c.ctags.PatternLengthLimit = c.GetInt("CTAGS_PATTERN_LENGTH_LIMIT", "250", "the maximum length of the patterns output by ctags")
	c.ctags.LogErrors = os.Getenv("DEPLOY_TYPE") == "dev"
	c.ctags.DebugLogs = false

	c.sanityCheck = c.GetBool("SANITY_CHECK", "false", "check that go-sqlite3 works then exit 0 if it's ok or 1 if not")
	c.cacheDir = c.Get("CACHE_DIR", "/tmp/symbols-cache", "directory in which to store cached symbols")
	c.cacheSizeMB = c.GetInt("SYMBOLS_CACHE_SIZE_MB", "100000", "maximum size of the disk cache (in megabytes)")
	c.numCtagsProcesses = c.GetInt("CTAGS_PROCESSES", strconv.Itoa(runtime.GOMAXPROCS(0)), "number of concurrent parser processes to run")
	c.requestBufferSize = c.GetInt("REQUEST_BUFFER_SIZE", "8192", "maximum size of buffered parser request channel")
	c.useRockskip = c.GetBool("USE_ROCKSKIP", "false", "use Rockskip and Postgres instead of SQLite")
}

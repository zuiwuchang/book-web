package configure

import (
	"encoding/json"
	"io/ioutil"
	"path/filepath"

	"github.com/google/go-jsonnet"
	logger "gitlab.com/king011/king-go/log/logger.zap"
)

// Configure global configure
type Configure struct {
	Logger logger.Options
}

// Format format global configure
func (c *Configure) Format(basePath string) (e error) {

	return
}
func (c *Configure) String() string {
	if c == nil {
		return "nil"
	}
	b, e := json.MarshalIndent(c, "", "	")
	if e != nil {
		return e.Error()
	}
	return string(b)
}

var _Configure Configure

// Single single Configure
func Single() *Configure {
	return &_Configure
}

// Load load configure file
func (c *Configure) Load(filename string) (e error) {
	if filepath.IsAbs(filename) {
		filename = filepath.Clean(filename)
	} else {
		filename, e = filepath.Abs(filename)
		if e != nil {
			return
		}
	}
	var b []byte
	b, e = ioutil.ReadFile(filename)
	if e != nil {
		return
	}
	vm := jsonnet.MakeVM()
	vm.Importer(&jsonnet.FileImporter{})
	var jsonStr string
	jsonStr, e = vm.EvaluateSnippet(filename, string(b))
	if e != nil {
		return
	}
	b = []byte(jsonStr)
	e = json.Unmarshal(b, c)
	if e != nil {
		return
	}
	return
}

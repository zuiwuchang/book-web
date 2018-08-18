package configure

import (
	"encoding/json"
	"github.com/google/go-jsonnet"
	"io/ioutil"
	"strings"
)

const confileName = "/conf/app.jsonnet"

var _Configure Configure

// Configure .
type Configure struct {
	basePath string
	FileRoot string
}

func (c *Configure) format() {
	c.FileRoot = strings.TrimSpace(c.FileRoot)
}

// Load .
func Load(filename string) (cnf *Configure, e error) {

	var b []byte
	b, e = ioutil.ReadFile(filename + "/" + confileName)
	if e != nil {
		return
	}
	vm := jsonnet.MakeVM()
	var jsonStr string
	jsonStr, e = vm.EvaluateSnippet("", string(b))
	if e != nil {
		return
	}
	e = json.Unmarshal([]byte(jsonStr), &_Configure)
	if e != nil {
		return
	}

	_Configure.basePath = filename
	_Configure.format()
	return
}

// Get .
func Get() *Configure {
	return &_Configure
}

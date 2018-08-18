package configure

import (
	"encoding/json"
	"github.com/google/go-jsonnet"
	"io/ioutil"
	"path/filepath"
	"strings"
)

const confileName = "/conf/app.jsonnet"

var _Configure Configure

// Configure .
type Configure struct {
	basePath string
	FileRoot string
	Root     Root
	Locale   []Locale
}

// MatchLocale .
func (c *Configure) MatchLocale(locale string) string {
	for i := 0; i < len(c.Locale); i++ {
		if c.Locale[i].ID == "" {
			continue
		}
		for _, match := range c.Locale[i].rules {
			if match.MatchString(locale) {
				return c.Locale[i].ID
			}
		}
	}
	return ""
}
func (c *Configure) format() {
	c.FileRoot = strings.TrimSpace(c.FileRoot)
	if c.FileRoot == "" {
		c.FileRoot = c.basePath + "/fileroot"
	} else if !filepath.IsAbs(c.FileRoot) {
		c.FileRoot = c.basePath + "/" + c.FileRoot
	}
	c.Root.format()
	for i := 0; i < len(c.Locale); i++ {
		c.Locale[i].format()
	}
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

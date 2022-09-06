package web

import (
	"bytes"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func (h Helper) toHTTPError(c *gin.Context, name string, e error) {
	if os.IsNotExist(e) {
		h.NegotiateErrorString(c, http.StatusNotFound, `not exists : `+name)
		return
	}
	if os.IsPermission(e) {
		h.NegotiateErrorString(c, http.StatusForbidden, `forbidden : `+name)
		return
	}
	h.NegotiateError(c, http.StatusInternalServerError, e)
}

// NegotiateFilesystem .
func (h Helper) NegotiateFilesystem(c *gin.Context, fs http.FileSystem, path string, index bool) {
	if path == `/` || path == `` {
		path = `/index.html`
	}
	f, e := fs.Open(path)
	if e != nil {
		if !index {
			h.toHTTPError(c, path, e)
			return
		}
		if path != `/index.html` && os.IsNotExist(e) {
			path = `/index.html`
			f, e = fs.Open(path)
		}
	}
	if e != nil {
		h.toHTTPError(c, path, e)
		return
	}
	stat, e := f.Stat()
	if e != nil {
		f.Close()
		h.toHTTPError(c, path, e)
		return
	}
	if stat.IsDir() {
		f.Close()
		h.NegotiateErrorString(c, http.StatusForbidden, `not a file`)
		return
	}

	_, name := filepath.Split(path)
	http.ServeContent(c.Writer, c.Request, name, stat.ModTime(), f)
	f.Close()
}

// NegotiateJSONFile .
func (h Helper) NegotiateJSONFile(c *gin.Context, name string, modtime time.Time, obj interface{}) {
	b, e := json.Marshal(obj)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}

	http.ServeContent(c.Writer, c.Request, name, modtime, bytes.NewReader(b))
}

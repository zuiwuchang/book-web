package static

import (
	"net/http"
	"os"
	"path/filepath"

	"book-web/logger"
	"book-web/web"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/rakyll/statik/fs"
	"go.uber.org/zap"
)

// BaseURL request base url
const BaseURL = `/static`

// Helper path of /app
type Helper struct {
	web.Helper
}

var filesystem http.FileSystem

// Register impl IHelper
func (h Helper) Register(router *gin.RouterGroup) {
	var e error
	filesystem, e = fs.NewWithNamespace(`static`)
	if e != nil {
		if ce := logger.Logger.Check(zap.FatalLevel, `New FileSystem error`); ce != nil {
			ce.Write(
				zap.Error(e),
				zap.String(`namespace`, `static`),
			)
		}
		os.Exit(1)
	}

	r := router.Group(BaseURL)
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.GET(`/*path`, h.view)
}
func (h Helper) view(c *gin.Context) {
	var obj struct {
		Path string `uri:"path" `
	}
	e := h.BindURI(c, &obj)
	if e != nil {
		return
	}
	h.viewFilesystem(c, filesystem, obj.Path)
}
func (h Helper) toHTTPError(c *gin.Context, e error) {
	if os.IsNotExist(e) {
		h.NegotiateError(c, http.StatusNotFound, e)
		return
	}
	if os.IsPermission(e) {
		h.NegotiateError(c, http.StatusForbidden, e)
		return
	}
	h.NegotiateError(c, http.StatusInternalServerError, e)
}
func (h Helper) viewFilesystem(c *gin.Context, fs http.FileSystem, path string) {
	f, e := fs.Open(path)
	if e != nil {
		h.toHTTPError(c, e)
		return
	}
	stat, e := f.Stat()
	if e != nil {
		f.Close()
		h.toHTTPError(c, e)
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

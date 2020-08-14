package v1

import (
	"book-web/db/manipulator"
	"book-web/web"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

// Assets 資源管理
type Assets struct {
	web.Helper
}

// Register impl IHelper
func (h Assets) Register(router *gin.RouterGroup) {
	r := router.Group(`assets`)
	r.Use(h.CheckSession)

	r.POST(`upload/:book/:chapter`, h.upload)
}
func (h Assets) upload(c *gin.Context) {
	var obj struct {
		Book    string `uri:"book"`
		Chapter string `uri:"chapter"`
	}
	e := h.BindURI(c, &obj)
	if e != nil {
		return
	}
	var mBook manipulator.Book
	dir, e := mBook.DirectoryAssets(obj.Book, obj.Chapter)
	if e != nil {
		h.NegotiateError(c, http.StatusBadRequest, e)
		return
	}

	file, header, e := c.Request.FormFile("file")
	if e != nil {
		h.NegotiateError(c, http.StatusBadRequest, e)
		return
	}
	defer file.Close()
	filename := filepath.Clean(filepath.Join(dir, header.Filename))
	s0, s1 := filepath.Split(filename)
	if filepath.Clean(s0) != filepath.Clean(dir) || s1 != header.Filename {
		h.NegotiateErrorString(c, http.StatusBadRequest, "filename not supported")
		return
	}
	f, e := os.Create(filename)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	_, e = io.Copy(f, file)
	if e == nil {
		c.Status(http.StatusNoContent)
	} else {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		os.Remove(filename)
	}
}

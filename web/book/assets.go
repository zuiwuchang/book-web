package book

import (
	"book-web/db/manipulator"
	"book-web/web"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Assets path of /book/assets
type Assets struct {
	web.Helper
}

// Register impl IHelper
func (h Assets) Register(router *gin.RouterGroup) {
	r := router.Group(`assets`)

	r.GET(`:book/:chapter/assets/:filename`, h.get)
}
func (h Assets) get(c *gin.Context) {
	var obj struct {
		Book     string `uri:"book" binding:"required"`
		Chapter  string `uri:"chapter" binding:"required"`
		Filename string `uri:"filename"  binding:"required"`
	}
	e := h.BindURI(c, &obj)
	if e != nil {
		return
	}
	var mBook manipulator.Book
	filename, e := mBook.Assets(obj.Book, obj.Chapter, obj.Filename)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	c.File(filename)
}

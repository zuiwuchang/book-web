package v1

import (
	"book-web/db/manipulator"
	"book-web/web"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Chapters 書籍章節管理
type Chapters struct {
	web.Helper
}

// Register impl IHelper
func (h Chapters) Register(router *gin.RouterGroup) {
	r := router.Group(`chapters`)
	r.GET(``, h.list)
	r.GET(`text`, h.Gzip(), h.get)
	r.PUT(`text`, h.CheckSession, h.put)
}
func (h Chapters) list(c *gin.Context) {
	var obj struct {
		ID string `form:"id" json:"id" xml:"id" yaml:"id" binding:"required"`
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	book, modTime, e := mBook.Get(obj.ID)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	h.NegotiateJSONFile(c, obj.ID, modTime, book)
}
func (h Chapters) get(c *gin.Context) {
	var obj struct {
		Book    string `form:"book" json:"book" xml:"book" yaml:"book" binding:"required"`
		Chapter string `form:"chapter" json:"chapter" xml:"chapter" yaml:"chapter" binding:"required"`
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	filename, e := mBook.Chapter(obj.Book, obj.Chapter)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	c.File(filename)
}
func (h Chapters) put(c *gin.Context) {
	var obj struct {
		Book    string `form:"book" json:"book" xml:"book" yaml:"book" binding:"required"`
		Chapter string `form:"chapter" json:"chapter" xml:"chapter" yaml:"chapter" binding:"required"`
		Text    string `form:"text" json:"text" xml:"text" yaml:"text" `
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	e = mBook.UpdateChapter(obj.Book, obj.Chapter, obj.Text)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	c.Status(http.StatusNoContent)
}

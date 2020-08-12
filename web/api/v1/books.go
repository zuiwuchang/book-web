package v1

import (
	"book-web/db/data"
	"book-web/db/manipulator"
	"book-web/web"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Books 書籍管理
type Books struct {
	web.Helper
}

// Register impl IHelper
func (h Books) Register(router *gin.RouterGroup) {
	r := router.Group(`books`)
	r.Use(h.CheckSession)
	r.GET(``, h.list)
	r.POST(``, h.add)
	r.DELETE(``, h.remove)
	r.PATCH(`name`, h.rename)
	r.PATCH(`id`, h.changeID)
}
func (h Books) list(c *gin.Context) {
	var obj struct {
		ID   string `form:"id" json:"id" xml:"id" yaml:"id"`
		Name string `form:"name" json:"name" xml:"name" yaml:"name"`
	}
	e := h.BindQuery(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	var books []data.Book
	books, e = mBook.Find(obj.ID, obj.Name)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	h.NegotiateData(c, http.StatusOK, books)
}
func (h Books) add(c *gin.Context) {
	var obj struct {
		ID   string `form:"id" json:"id" xml:"id" yaml:"id"`
		Name string `form:"name" json:"name" xml:"name" yaml:"name"`
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	e = mBook.New(obj.ID, obj.Name)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	c.Status(http.StatusNoContent)
}
func (h Books) remove(c *gin.Context) {
	var obj struct {
		ID string `form:"id" json:"id" xml:"id" yaml:"id"`
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	e = mBook.Remove(obj.ID)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	c.Status(http.StatusNoContent)
}
func (h Books) rename(c *gin.Context) {
	var obj struct {
		ID   string `form:"id" json:"id" xml:"id" yaml:"id"`
		Name string `form:"name" json:"name" xml:"name" yaml:"name"`
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	e = mBook.Rename(obj.ID, obj.Name)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	c.Status(http.StatusNoContent)
}
func (h Books) changeID(c *gin.Context) {
	var obj struct {
		ID     string `form:"id" json:"id" xml:"id" yaml:"id"`
		Target string `form:"target" json:"target" xml:"target" yaml:"target"`
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}

	var mBook manipulator.Book
	e = mBook.ChangeID(obj.ID, obj.Target)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	c.Status(http.StatusNoContent)
}

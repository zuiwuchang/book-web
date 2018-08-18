package controllers

import (
	"book-web/app/module/angular"
	"github.com/revel/revel"
	"os"
)

// Angular .
type Angular struct {
	Controller
}

// Index .
func (c Angular) Index() revel.Result {
	filepath, e := angular.Filepath(c.Request.GetPath())
	if e != nil {
		if os.IsNotExist(e) {
			return c.NotFound(e.Error())
		}
		return c.RenderError(e)
	}
	return c.RenderFileName(filepath, revel.NoDisposition)
}

package v1

import (
	"book-web/web"
	"net/http"

	"book-web/db/manipulator"

	"github.com/gin-gonic/gin"
)

// Git 執行 git 指令
type Git struct {
	web.Helper
}

// Register impl IHelper
func (h Git) Register(router *gin.RouterGroup) {
	router.POST(`/git`, h.CheckSession, h.git)
}
func (h Git) git(c *gin.Context) {
	var obj struct {
		Command string `form:"command" json:"command" xml:"command" yaml:"command" binding:"required"`
		Extend  string `form:"extend" json:"extend" xml:"extend" yaml:"extend"`
	}
	e := h.Bind(c, &obj)
	if e != nil {
		return
	}
	var mGit manipulator.Git
	var result string

	result, e = mGit.Execute(obj.Command, obj.Extend)
	if e != nil {
		h.NegotiateError(c, http.StatusInternalServerError, e)
		return
	}
	h.NegotiateData(c, http.StatusOK, result)
}

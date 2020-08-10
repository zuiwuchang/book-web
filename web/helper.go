package web

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// Offered accept Offered
var Offered = []string{
	binding.MIMEJSON,
	binding.MIMEHTML,
	binding.MIMEXML,
	binding.MIMEYAML,
}

// Helper 輔助類型
type Helper struct {
}

// NegotiateData .
func (h Helper) NegotiateData(c *gin.Context, code int, data interface{}) {
	switch c.NegotiateFormat(Offered...) {
	case binding.MIMEXML:
		c.XML(code, data)
	case binding.MIMEYAML:
		c.YAML(code, data)
	default:
		// 默認以 json
		c.JSON(code, data)
	}
}

// BindURI .
func (h Helper) BindURI(c *gin.Context, obj interface{}) (e error) {
	e = c.ShouldBindUri(obj)
	if e != nil {
		h.NegotiateError(c, http.StatusBadRequest, e)
		return
	}
	return
}

// NegotiateError .
func (h Helper) NegotiateError(c *gin.Context, code int, e error) {
	c.String(code, e.Error())
}

// NegotiateErrorString .
func (h Helper) NegotiateErrorString(c *gin.Context, code int, e string) {
	c.String(code, e)
}

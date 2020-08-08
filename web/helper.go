package web

import (
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

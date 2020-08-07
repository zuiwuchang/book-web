package web

import (
	"fmt"

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
	fmt.Println("-----------------", c, code, data)
	c.Negotiate(code, gin.Negotiate{
		Offered: Offered,
		Data:    data,
	})
}

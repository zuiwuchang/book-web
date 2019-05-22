package controllers

import (
	"book-web/app/module/db/data"
	"book-web/app/module/protocol"
	"errors"
	"strings"

	"github.com/revel/revel"
)

var errPermissionDenied = errors.New("Permission Denied")

// Controller 為 控制器的 提供了 輔助方法
type Controller struct {
	*revel.Controller
}

type _ErrorJSON struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

// RenderError 修復 application/json 時 e 中帶有 ' " 符號 瀏覽器 無法解析
func (c Controller) RenderError(e error) revel.Result {
	val := c.Request.Header.Get("Accept")
	if strings.Index(val, "application/json") == -1 {
		return c.Controller.RenderError(e)
	}

	c.Response.Status = 500
	return c.RenderJSON(&_ErrorJSON{
		"Server Error",
		e.Error(),
	})
}

// UnmarshalSession 返回 session
func (c Controller) UnmarshalSession() (session *protocol.Session) {
	var ok bool
	// other
	name, ok := c.Session[protocol.SessionColNickname]
	if !ok {
		return
	}
	nickname, ok := c.Session[protocol.SessionColName]
	if !ok {
		return
	}
	if strName, ok := name.(string); ok {
		if strNickname, ok := nickname.(string); ok {
			session = &protocol.Session{
				Name:     strName,
				Nickname: strNickname,
			}
		}
	}

	return
}

// NewSession .
func (c Controller) NewSession(u *data.User) *protocol.Session {
	if u == nil {
		return nil
	}
	return &protocol.Session{
		Nickname: u.Nickname,
		Name:     u.Name,
	}
}

// MarshalSession .
func (c Controller) MarshalSession(session *protocol.Session) {
	if session == nil {
		delete(c.Session, protocol.SessionColNickname)
		delete(c.Session, protocol.SessionColName)
		return
	}
	c.Session[protocol.SessionColNickname] = session.Nickname
	c.Session[protocol.SessionColName] = session.Name
}

// RenderPermissionDenied .
func (c Controller) RenderPermissionDenied() revel.Result {
	return c.RenderError(errPermissionDenied)
}

package controllers

import (
	"book-web/app/module/db/data"
	"book-web/app/module/protocol"
	"errors"
	"github.com/revel/revel"
	"strings"
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
	keys := c.Session
	s := &protocol.Session{}
	var ok bool
	// other
	s.Nickname, ok = keys[protocol.SessionColNickname]
	if !ok {
		revel.ERROR.Printf("no Session.Nickname %v\n", keys)
		return
	}
	s.Name, ok = keys[protocol.SessionColName]
	if !ok {
		revel.ERROR.Printf("no Session.Name %v\n", keys)
		return
	}
	session = s
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
	keys := c.Session
	if session == nil {
		delete(keys, protocol.SessionColNickname)
		delete(keys, protocol.SessionColName)
		return
	}
	keys[protocol.SessionColNickname] = session.Nickname
	keys[protocol.SessionColName] = session.Name
}

// RenderPermissionDenied .
func (c Controller) RenderPermissionDenied() revel.Result {
	return c.RenderError(errPermissionDenied)
}

package controllers

import (
	"book-web/app/module/configure"
	"book-web/app/module/db/manipulator"
	"book-web/app/module/protocol"
	"github.com/revel/revel"
	"net/http"
	"strings"
	"time"
)

// App .
type App struct {
	Controller
}

// Version .
func (c App) Version() revel.Result {
	return c.RenderJSON(protocol.Version{
		Version: Version,
		Commit:  Commit,
		Date:    Date,
	})
}

// Index .
func (c App) Index() revel.Result {
	// 識別語言
	locale := strings.ToLower(strings.TrimSpace(c.Request.Locale))

	locale = configure.Get().MatchLocale(locale)
	if locale == "" {
		revel.WARN.Println("unknow locale use default")
		locale = "zh-Hant"
	}

	return c.Redirect("/angular/" + locale)
	//return c.Render()
}

// GetSession 返回 當前信息
func (c App) GetSession() revel.Result {
	// 是否已經 登入
	session := c.UnmarshalSession()
	if session != nil {
		return c.RenderJSON(session)
	}

	if disabled, _ := c.Session[SessionAutoLogin]; disabled == Disabled {
		revel.TRACE.Println("auto login disabled")
		return c.RenderJSON(nil)
	}

	// 自動 登入
	cookie, e := c.Request.Cookie(CookieKeyName)
	if e != nil {
		revel.WARN.Println(e)
		return c.RenderJSON(nil)
	}
	name := cookie.GetValue()
	if name == "" {
		revel.TRACE.Println("cookie[name] empty")
		return c.RenderJSON(nil)
	}

	cookie, e = c.Request.Cookie(CookieKeyPassword)
	if e != nil {
		revel.WARN.Println(e)
		return c.RenderJSON(nil)
	}
	pwd := cookie.GetValue()
	if pwd == "" {
		revel.TRACE.Println("cookie[pwd] empty")
		return c.RenderJSON(nil)
	}

	// 驗證 密碼
	var mUser manipulator.User
	u, e := mUser.Login(name, pwd)
	if e != nil {
		revel.TRACE.Println(e)
		return c.RenderJSON(nil)
	}

	// 寫入 登入 信息
	session = c.NewSession(u)
	c.MarshalSession(session)
	revel.TRACE.Println("auto login", session)
	// 返回 nil
	return c.RenderJSON(session)
}

// Login 登入
func (c App) Login() revel.Result {
	var params struct {
		Name     string
		Password string
		Remember bool
	}
	e := c.Params.BindJSON(&params)
	if e != nil {
		return c.RenderError(e)
	}

	// 驗證 密碼
	var m manipulator.User
	u, e := m.Login(params.Name, params.Password)
	if e != nil {
		return c.RenderError(e)
	}

	// 寫入 登入 信息
	session := c.NewSession(u)
	c.MarshalSession(session)

	if params.Remember {
		expiration := time.Now()
		expiration = expiration.AddDate(0, 0, 7)
		c.SetCookie(
			&http.Cookie{
				Name:    CookieKeyName,
				Value:   params.Name,
				Expires: expiration,
			},
		)
		c.SetCookie(
			&http.Cookie{
				Name:    CookieKeyPassword,
				Value:   params.Password,
				Expires: expiration,
			},
		)
	} else {
		expiration := time.Now()
		c.SetCookie(
			&http.Cookie{
				Name:    CookieKeyName,
				Value:   "",
				Expires: expiration,
			},
		)
		c.SetCookie(
			&http.Cookie{
				Name:    CookieKeyPassword,
				Value:   "",
				Expires: expiration,
			},
		)
	}

	return c.RenderJSON(session)
}

// Logout 登出
func (c App) Logout() revel.Result {
	c.MarshalSession(nil)
	c.Session[SessionAutoLogin] = Disabled
	return c.RenderJSON(nil)
}

package controllers

import (
	"book-web/app/module/configure"
	"book-web/app/module/db/manipulator"
	"book-web/app/module/logger"
	"book-web/app/module/protocol"
	"book-web/app/version"
	"fmt"
	"net/http"
	"runtime"
	"strings"
	"time"

	"go.uber.org/zap"

	"github.com/revel/revel"
)

// App .
type App struct {
	Controller
}

// Version .
func (c App) Version() revel.Result {
	return c.RenderJSON(&protocol.Version{
		Platform: fmt.Sprintf("%s %s %s", runtime.GOOS, runtime.GOARCH, runtime.Version()),
		Revel:    revel.Version,
		Version:  version.Tag,
		Commit:   version.Commit,
		Date:     version.Date,
	})
}

// Index .
func (c App) Index() revel.Result {
	if revel.DevMode {
		return c.Render()
	}

	// 識別語言
	locale := strings.ToLower(strings.TrimSpace(c.Request.Locale))

	locale = configure.Get().MatchLocale(locale)
	if locale == "" {
		cnf := configure.Get()
		if ce := logger.Logger.Check(zap.WarnLevel, "unknow locale use default"); ce != nil {
			ce.Write(
				zap.String("locale", locale),
				zap.String("default", cnf.DefaultLocale),
			)
		}
		locale = cnf.DefaultLocale
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
		if ce := logger.Logger.Check(zap.DebugLevel, "auto login disabled"); ce != nil {
			ce.Write()
		}
		return c.RenderJSON(nil)
	}

	// 自動 登入
	cookie, e := c.Request.Cookie(CookieKeyName)
	if e != nil {
		if ce := logger.Logger.Check(zap.WarnLevel, "cookie[name]"); ce != nil {
			ce.Write(
				zap.Error(e),
			)
		}
		return c.RenderJSON(nil)
	}
	name := cookie.GetValue()
	if name == "" {
		if ce := logger.Logger.Check(zap.DebugLevel, "cookie[name] empty"); ce != nil {
			ce.Write()
		}
		return c.RenderJSON(nil)
	}

	cookie, e = c.Request.Cookie(CookieKeyPassword)
	if e != nil {
		if ce := logger.Logger.Check(zap.WarnLevel, "cookie[pwd]"); ce != nil {
			ce.Write(
				zap.Error(e),
			)
		}
		return c.RenderJSON(nil)
	}
	pwd := cookie.GetValue()
	if pwd == "" {
		if ce := logger.Logger.Check(zap.DebugLevel, "cookie[pwd] empty"); ce != nil {
			ce.Write()
		}
		return c.RenderJSON(nil)
	}

	// 驗證 密碼
	var mUser manipulator.User
	u, e := mUser.Login(name, pwd)
	if e != nil {
		if ce := logger.Logger.Check(zap.DebugLevel, "Login Error"); ce != nil {
			ce.Write(
				zap.Error(e),
			)
		}
		return c.RenderJSON(nil)
	}

	// 寫入 登入 信息
	session = c.NewSession(u)
	c.MarshalSession(session)
	if ce := logger.Logger.Check(zap.DebugLevel, "auto login"); ce != nil {
		ce.Write(
			zap.String("name", session.Name),
			zap.String("nick", session.Nickname),
		)
	}
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

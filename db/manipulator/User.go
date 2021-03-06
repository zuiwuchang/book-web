package manipulator

import (
	"book-web/cookie"
	"book-web/db/data"
	"errors"
)

var errLogin = errors.New("name pwd not match")
var _User data.User

// User .
type User struct {
}

// Login 登入 並返回 用戶信息
func (User) Login(name, pwd string) (session *cookie.Session, e error) {
	if _User.Name != name || _User.Password != pwd {
		e = errLogin
		return
	}
	session = &cookie.Session{
		Name:     _User.Name,
		Nickname: _User.Nickname,
		Root:     true,
	}
	return
}

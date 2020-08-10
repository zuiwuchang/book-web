package cookie

import (
	"encoding/gob"
	"fmt"
)

const (
	// CookieName cookie key name
	CookieName = "golang-book-web-session"
)

func init() {
	gob.Register(&Session{})
}

// Session user session info
type Session struct {
	Name string `json:"name,omitempty"`
	// 是否是 root
	Root bool `json:"root,omitempty"`
}

// Cookie encode to cookie
func (s *Session) String() string {
	return fmt.Sprintf(`%s root=%v`, s.Name, s.Root)
}

// Cookie encode to cookie
func (s *Session) Cookie() (string, error) {
	return Encode("session", s)
}

// IsRoot if user is root return true
func (s *Session) IsRoot() (yes bool) {
	yes = s.Root
	return
}

// FromCookie restore session from cookie
func FromCookie(val string) (session *Session, e error) {
	var s Session
	e = Decode("session", val, &s)
	if e != nil {
		return
	}
	session = &s
	return
}

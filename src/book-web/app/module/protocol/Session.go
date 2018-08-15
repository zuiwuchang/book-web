package protocol

import (
	"encoding/json"
)

const (
	// SessionColNickname .
	SessionColNickname = "S.Nickname"
	// SessionColName .
	SessionColName = "S.Name"
)

// Session .
type Session struct {
	Nickname string
	Name     string
}

func (s *Session) String() string {
	b, e := json.Marshal(s)
	if e != nil {
		return e.Error()
	}
	return string(b)
}

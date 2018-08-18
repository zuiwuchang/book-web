package configure

import (
	"book-web/app/module/utils"
	"strings"
)

// Root .
type Root struct {
	Name           string
	Nickname       string
	Password       string
	PasswordSha512 bool
}

func (r *Root) format() {
	r.Name = strings.TrimSpace(r.Name)
	r.Nickname = strings.TrimSpace(r.Nickname)
	r.Password = strings.TrimSpace(r.Password)
	if r.Name == "" {
		r.Name = "king"
	}
	if r.Nickname == "" {
		r.Nickname = r.Name
	}
	if r.Password == "" {
		r.Password = "cerberus is an idea"
	}

	if r.PasswordSha512 {
		r.Password = strings.ToLower(strings.TrimSpace(r.Password))
	} else {
		var e error
		r.Password, e = utils.SHA512(r.Password)
		if e != nil {
			panic(e)
		}
		r.Password = strings.ToLower(r.Password)
	}
}

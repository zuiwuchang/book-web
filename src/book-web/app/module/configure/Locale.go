package configure

import (
	"log"
	"regexp"
	"strings"
)

// Locale .
type Locale struct {
	ID    string
	Rules []string
	rules []*regexp.Regexp
}

func (l *Locale) format() {
	l.ID = strings.TrimSpace(l.ID)
	if l.ID == "" {
		return
	}
	if len(l.Rules) == 0 {
		l.ID = ""
		return
	}
	l.rules = make([]*regexp.Regexp, 0, len(l.rules))
	for i := 0; i < len(l.Rules); i++ {
		rule := strings.TrimSpace(l.Rules[i])
		if rule == "" {
			continue
		}

		r, e := regexp.Compile(rule)
		if e == nil {
			l.rules = append(l.rules, r)
		} else {
			log.Println(e)
		}
	}
	if len(l.rules) == 0 {
		l.ID = ""
	}
}

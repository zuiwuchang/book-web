package utils

import (
	"strings"
	"time"

	"github.com/mozillazg/go-pinyin"
)

var pinyinArgs = pinyin.NewArgs()

func init() {
	pinyinArgs.Fallback = func(r rune, a pinyin.Args) []string {
		if r == '-' ||
			(r >= '0' && r <= '9') ||
			(r >= 'a' && r <= 'z') ||
			(r >= 'A' && r <= 'Z') {
			return []string{string(r)}
		}
		return nil
	}
}

// NewIDByName .
func NewIDByName(name string) (id string) {
	id = strings.Join(pinyin.LazyConvert(name, &pinyinArgs), "")
	if id == "" {
		id = time.Now().Format("auto-2006-01-02")
		return
	}
	r := rune(id[0])
	if (r >= 'a' && r <= 'z') ||
		(r >= 'A' && r <= 'Z') {
		return
	}
	id = "auto-" + id
	return
}

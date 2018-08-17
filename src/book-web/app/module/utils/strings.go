package utils

import (
	"strings"
)

// IsFilename .
func IsFilename(name string) (yes bool) {
	if name == "" ||
		name == "." ||
		strings.Index(name, "..") != -1 ||
		strings.Index(name, "/") != -1 ||
		strings.Index(name, "\\") != -1 {
		return
	}
	name = strings.TrimSpace(name)
	if name == "" || name == "." {
		return
	}
	yes = true
	return
}

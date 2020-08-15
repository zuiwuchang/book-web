package configure

import "strings"

// Google google service
type Google struct {
	Analytics string
	AdSense   string
}

// Format .
func (g *Google) Format(basePath string) (e error) {
	g.Analytics = strings.TrimSpace(g.Analytics)
	g.AdSense = strings.TrimSpace(g.AdSense)
	return
}

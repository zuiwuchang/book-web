package configure

import (
	"path/filepath"
	"strings"
)

// Google google service
type Google struct {
	Analytics string
	AdSense   string
	Ads       string
}

// Format .
func (g *Google) Format(basePath string) (e error) {
	g.Analytics = strings.TrimSpace(g.Analytics)
	g.AdSense = strings.TrimSpace(g.AdSense)
	g.Ads = strings.TrimSpace(g.Ads)
	if g.Ads == `` {
		g.Ads = filepath.Clean(basePath + "/ads.txt")
	} else if filepath.IsAbs(g.Ads) {
		g.Ads = filepath.Clean(g.Ads)
	} else {
		g.Ads = filepath.Clean(basePath + "/" + g.Ads)
	}
	return
}

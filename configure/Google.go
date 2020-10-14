package configure

import (
	"path/filepath"
	"strings"
)

// Google google service
type Google struct {
	Analytics string
	AdSense   AdSense
	Ads       string
}

// Format .
func (g *Google) Format(basePath string) (e error) {
	g.Analytics = strings.TrimSpace(g.Analytics)
	e = g.AdSense.Format(basePath)
	if e != nil {
		return
	}
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

// AdSense .
type AdSense struct {
	Auto   string
	Top    Ads
	Bottom Ads
	Text   Ads
}

// Format .
func (a *AdSense) Format(basePath string) (e error) {
	a.Auto = strings.TrimSpace(a.Auto)
	e = a.Top.Format(basePath)
	if e != nil {
		return
	}
	e = a.Bottom.Format(basePath)
	if e != nil {
		return
	}
	return
}

// Ads .
type Ads struct {
	ID        string
	Slot      string
	Frequency int
}

// Format .
func (a *Ads) Format(basePath string) (e error) {
	a.ID = strings.TrimSpace(a.ID)
	a.Slot = strings.TrimSpace(a.Slot)
	return
}

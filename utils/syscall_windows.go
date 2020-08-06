package utils

import (
	"os"
	"time"
)

// Quit send quit signal
func Quit() {
	time.Sleep(time.Second * 2)
	os.Exit(1)
}

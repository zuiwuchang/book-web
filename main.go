package main

import (
	_ "book-web/assets/en-US/statik"
	_ "book-web/assets/static/statik"
	_ "book-web/assets/zh-Hans/statik"
	_ "book-web/assets/zh-Hant/statik"
	"book-web/cmd"
	"log"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	if e := cmd.Execute(); e != nil {
		log.Fatalln(e)
	}
}

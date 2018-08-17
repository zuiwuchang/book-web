package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type Hello struct{}

func (h Hello) ServeHTTP(
	w http.ResponseWriter,
	r *http.Request) {
	fmt.Fprint(w, "it work")
}

func main() {
	var laddr string
	var help bool
	flag.StringVar(&laddr, "laddr", "localhost:9000", "bind work addrdess")
	flag.BoolVar(&help, "h", false, "show help")
	flag.Parse()
	if help {
		flag.PrintDefaults()
		return
	}
	laddr = strings.TrimSpace(laddr)
	log.Println("work at", laddr)

	var h Hello
	e := http.ListenAndServe(laddr, h)
	if e != nil {
		log.Fatalln(e)
	}
}

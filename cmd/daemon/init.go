package daemon

import (
	"crypto/tls"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"golang.org/x/net/http2"

	"book-web/configure"
	"book-web/logger"

	"go.uber.org/zap"
)

// Run run as deamon
func Run(debug bool) {
	if debug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}
	cnf := configure.Single().HTTP
	l, e := net.Listen(`tcp`, cnf.Addr)
	if e != nil {
		if ce := logger.Logger.Check(zap.FatalLevel, `listen error`); ce != nil {
			ce.Write(
				zap.Error(e),
			)
		}
		os.Exit(1)
	}
	if cnf.TLS() {
		if cnf.H2 {
			if ce := logger.Logger.Check(zap.InfoLevel, `h2 work`); ce != nil {
				ce.Write(
					zap.String(`addr`, cnf.Addr),
				)
			}
			if !logger.Logger.OutConsole() {
				log.Println(`h2 work`, cnf.Addr)
			}
		} else {
			if ce := logger.Logger.Check(zap.InfoLevel, `https work`); ce != nil {
				ce.Write(
					zap.String(`addr`, cnf.Addr),
				)
			}
			if !logger.Logger.OutConsole() {
				log.Println(`https work`, cnf.Addr)
			}
		}
	} else {
		if cnf.H2 {
			if ce := logger.Logger.Check(zap.InfoLevel, `h2c work`); ce != nil {
				ce.Write(
					zap.String(`addr`, cnf.Addr),
				)
			}
			if !logger.Logger.OutConsole() {
				log.Println(`h2c work`, cnf.Addr)
			}
		} else {
			if ce := logger.Logger.Check(zap.InfoLevel, `http work`); ce != nil {
				ce.Write(
					zap.String(`addr`, cnf.Addr),
				)
			}
			if !logger.Logger.OutConsole() {
				log.Println(`http work`, cnf.Addr)
			}
		}
	}

	router := newGIN()

	if cnf.TLS() {
		if cnf.H2 {
			runH2(l, router, cnf.CertFile, cnf.KeyFile)
		} else {
			e = http.ServeTLS(l, router, cnf.CertFile, cnf.KeyFile)
		}
	} else {
		if cnf.H2 {
			e = runH2C(l, router)
		} else {
			e = http.Serve(l, router)
		}
	}
	if ce := logger.Logger.Check(zap.FatalLevel, `serve error`); ce != nil {
		ce.Write(
			zap.Error(e),
		)
	}
	os.Exit(1)
}
func runH2(l net.Listener, router http.Handler, certFile, keyFile string) (e error) {
	cert, e := tls.LoadX509KeyPair(certFile, keyFile)
	if e != nil {
		return
	}
	l = tls.NewListener(l, &tls.Config{
		Certificates: []tls.Certificate{cert},
	})

	e = runH2C(l, router)
	return
}
func runH2C(l net.Listener, router http.Handler) (e error) {
	srv := &http2.Server{}
	opts := &http2.ServeConnOpts{
		Handler: router,
	}
	var c net.Conn
	for {
		c, e = l.Accept()
		if e != nil {
			continue
		}
		go srv.ServeConn(c, opts)
	}
}

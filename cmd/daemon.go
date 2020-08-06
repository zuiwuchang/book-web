package cmd

import (
	"book-web/cmd/daemon"
	"book-web/configure"
	"book-web/logger"
	"book-web/utils"
	"log"

	"github.com/spf13/cobra"
)

func init() {
	var filename string
	basePath := utils.BasePath()
	var debug bool
	cmd := &cobra.Command{
		Use:   "daemon",
		Short: "run as daemon",
		Run: func(cmd *cobra.Command, args []string) {
			// load configure
			cnf := configure.Single()
			e := cnf.Load(filename)
			if e != nil {
				log.Fatalln(e)
			}
			e = cnf.Format(basePath)
			if e != nil {
				log.Fatalln(e)
			}

			// init logger
			e = logger.Init(basePath, &cnf.Logger)
			if e != nil {
				log.Fatalln(e)
			}

			// run
			daemon.Run(debug)
		},
	}
	flags := cmd.Flags()
	flags.StringVarP(&filename, "config",
		"c",
		utils.Abs(basePath, "book-web.jsonnet"),
		"configure file",
	)
	flags.BoolVarP(&debug, "debug",
		"d",
		false,
		"run as debug",
	)
	rootCmd.AddCommand(cmd)
}

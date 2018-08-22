package manipulator

import (
	"fmt"
	"os/exec"
	"regexp"
	"strings"
)

var match = regexp.MustCompile(`\\\/\"\'\~\&\|\` + "`")

// Git .
type Git struct {
}

// Execute 執行 git 指令
func (m Git) Execute(command, extend string) (result string, e error) {

	switch command {
	case "add":
		result, e = m.execute("git", "add", "-A")
	case "status":
		result, e = m.execute("git", "status")
	case "commit":
		extend = strings.TrimSpace(extend)
		if extend == "" || match.MatchString(extend) {
			e = fmt.Errorf("not support message [%v]", extend)
			return
		}
		result, e = m.execute("git", "commit", "-m", fmt.Sprintf(`"%v"`, extend))
	case "push":
		result, e = m.execute("git", "push", "origin", "master")
	case "pull":
		result, e = m.execute("git", "pull", "origin", "master")
	case "log":
		result, e = m.execute("git", "log", "-10")
	default:
		e = fmt.Errorf("not support %v", command)
	}
	return
}
func (m Git) execute(name string, arg ...string) (result string, e error) {
	cmd := exec.Command(name, arg...)
	cmd.Dir = _FileRoot
	var b []byte
	b, e = cmd.Output()
	if e != nil {
		if b != nil {
			name = "$ > " + name + " " + strings.Join(arg, " ") + " \n"
			result = fmt.Sprintf("%s%s", name, b)
			e = nil
		}
		return
	}
	name = "$ > " + name + " " + strings.Join(arg, " ") + " \n"
	result = strings.TrimSpace(string(b))
	if result == "" {
		result = name + "success"
	} else {
		result = name + result
	}
	return
}

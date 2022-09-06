Target="book-web"
Docker="king011/book-web"
Dir=$(cd "$(dirname $BASH_SOURCE)/.." && pwd)
Version="v1.1.0"
View=1
Platforms=(
    windows/amd64
    darwin/amd64
    linux/arm
    linux/amd64
)

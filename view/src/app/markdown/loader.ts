import { HttpClient } from '@angular/common/http';
import { Book } from '../core/protocol'
import { OpenedBook } from '../core/settings/settings.service';
import { isString, isArray } from 'king-node/dist/core';
import { requireDynamics } from '../core/core/utils';
import { ServerAPI } from '../core/core/api';
export class Loader {
    book: Book
    title: string
    text: string
    constructor(public readonly opened: OpenedBook) {
    }

    load(httpClient: HttpClient): Promise<string> {
        return new Promise((resolve, reject) => {
            const opened = this.opened
            let wait = 3
            let title: string
            const callback = (e?: any) => {
                if (!wait) {
                    return
                }
                if (e) {
                    reject(e)
                    wait = 0
                    return
                }
                --wait
                if (!wait) {
                    resolve(title)
                }
            }
            // 加載依賴
            requireDynamics('jquery', 'showdown', 'clipboard',

                'highlight',
                'shell', 'bash',
                'ini', 'json', 'yaml', 'protobuf',
                'xml', 'css', 'scss', 'less',
                'cpp', 'go', 'dart', 'java', 'javascript', 'typescript', 'python', 'lua', 'sql', 'kotlin',
                'cmake', 'makefile', 'dockerfile', 'gradle', 'http', 'markdown', 'nginx', 'vim',
            ).then(() => {
                callback()
            }, (e) => {
                callback(e)
            })

            // 請求 book
            ServerAPI.v1.chapters.get<Book>(httpClient, {
                params: {
                    id: opened.book,
                },
            }).then((book) => {
                this.book = book
                title = isString(book.name) && book.name.length != 0 ? book.name : opened.book
                this.title = title
                if (opened.chapter == "0") {
                    callback()
                    return
                }
                if (isArray(book.chapter)) {
                    for (let i = 0; i < book.chapter.length; i++) {
                        const chapter = book.chapter[i]
                        if (chapter.id == opened.chapter) {
                            title += ` -> ${chapter.name}`
                            this.title = chapter.name
                            break
                        }
                    }
                }
                callback()
                return
            }, (e) => {
                callback(e)
            })
            // 請求 文本
            ServerAPI.v1.text.get(httpClient, {
                params: {
                    book: opened.book,
                    chapter: opened.chapter,
                },
                responseType: 'text',
            }).then((text) => {
                this.text = text
                callback()
            }, (e) => {
                callback(e)
            })
        })
    }
}
import { RESTful } from './restful';
const root = '/api'

export const ServerAPI = {
    v1: {
        version: new RESTful(root, 'v1', 'version'),
        session: new RESTful(root, 'v1', 'session'),
        git: new RESTful(root, 'v1', 'git'),
        books: new RESTful(root, 'v1', 'books'),
        chapters: new RESTful(root, 'v1', 'chapters'),
        text: new RESTful(root, 'v1', 'chapters/text'),
        assets: new RESTful(root, 'v1', 'assets'),
    },
    static: {
        licenses: '/static/3rdpartylicenses.txt',
        license: '/static/LICENSE.txt',
    },
}
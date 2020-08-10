import { RESTful } from './restful';
const root = '/api'

export const ServerAPI = {
    v1: {
        version: new RESTful(root, 'v1', 'version'),
    },
    static: {
        license: '/static/LICENSE.txt',
    },
}
export class Item {
    // 是否命中 緩存
    Hit: boolean
    // 當 緩存 失效時 返回的 新值
    Val: string
    // 當 緩存 失效時 返回的 新增的 md5
    MD5: string

    ID?:string
}

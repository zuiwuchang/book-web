export class Setting {
    // 是否 顯示 章節
    Chapter: boolean = false;
    // 是否 顯示 段落
    Header: boolean = false;

    // 頁面 1(視圖) 2(編輯)
    Page: number = 0;
    BookID: string = '';
    ChapterID: string = '';

    // 是否 全屏
    Full: boolean = false;
}

export class Chapter {
    id: string
    name: string
}

export interface Book {
    id: string
    name: string
    chapter?: Array<Chapter>
}
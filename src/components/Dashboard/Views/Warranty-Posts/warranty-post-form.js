export default {
    title: 'Nội dung bài viết',
    attributes: [
        {
            prop: 'title',
            label: 'Tiêu đề',
            type: 'text',
            validate: 'required',
        },
        {
            prop: 'content',
            label: 'Nội dung',
            type: 'editor',
            validate: 'required',
        },
    ],
}
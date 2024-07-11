export default [
  {
    groups: [
      {
        title: 'information',
        attributes: [
          {
            prop: 'title',
            label: 'title',
            type: 'text',
            validate: 'required',
          },
          {
            prop: 'slug',
            label: 'handle',
            type: 'text',
            validate: 'required',
          },
          {
            prop: 'description',
            label: 'description',
            type: 'textarea',
          },
          {
            prop: 'content',
            label: 'content',
            type: 'editor',
          },
        ],
      },
    ],
  },
  {
    groups: [
      {
        title: 'moreInformation',
        attributes: [
          {
            prop: 'image',
            label: 'image',
            type: 'image',
            multiple: false,
          },
          {
            prop: 'isActive',
            label: 'isActive',
            type: 'boolean',
          },
        ],
      },
    ],
  },
];

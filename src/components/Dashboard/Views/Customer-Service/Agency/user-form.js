export default [
  {
    groups: [
      {
        title: 'information',
        attributes: [
          {
            prop: 'fullname',
            label: 'fullname',
            type: 'text',
            validate: 'required',
          },
          {
            prop: 'email',
            label: 'email',
            type: 'text',
            validate: 'required|email',
          },
          {
            prop: 'phone',
            label: 'phone',
            type: 'text',
          },
        ],
      },
    ],
  }
];

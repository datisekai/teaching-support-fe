export default {
  create: {
    title: 'scheduleNotification',
    attributes: [
      {
        prop: 'title',
        label: 'title',
        type: 'text',
        validate: 'required',
      },
      {
        prop: 'content',
        label: 'content',
        type: 'textarea',
        validate: 'required|max:200',
      },
      {
        prop: 'type',
        label: 'type',
        type: 'select',
        validate: 'required',
        options: ['news'],
        disabled: true,
      },
      {
        prop: 'sendAt',
        label: 'sendAt',
        type: 'datetime',
        validate: 'required',
        options: {
          disabledDate(time) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return time.getTime() < now.getTime();
          },
        },
      },
    ],
  },
  update: {
    title: 'scheduleNotification',
    attributes: [
      {
        prop: 'title',
        label: 'title',
        type: 'text',
        validate: 'required',
      },
      {
        prop: 'content',
        label: 'content',
        type: 'textarea',
        validate: 'required|max:200',
      },
      {
        prop: 'type',
        label: 'type',
        type: 'select',
        validate: 'required',
        options: ['news'],
        disabled: true,
      },
      {
        prop: 'sendAt',
        label: 'sendAt',
        type: 'datetime',
        validate: 'required',
        options: {
          disabledDate(time) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            return time.getTime() < now.getTime();
          },
        },
      },
      {
        prop: 'isProcessed',
        label: 'isNotificationProcessed',
        type: 'checkbox',
        disabled: true,
      },
    ],
  }
};
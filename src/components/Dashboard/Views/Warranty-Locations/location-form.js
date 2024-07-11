export default {
  title: 'Trung tâm bảo hành',
  attributes: [
    {
        prop: 'name',
        label: 'Tên trung tâm',
        type: 'text',
        validate: 'required',
    },
    {
        prop: 'address',
        label: 'Địa chỉ',
        type: 'text',
        validate: 'required',
    },
    {
        prop: 'district',
        label: 'Quận/Huyện',
        type: 'select',
        validate: 'required',
    },
    {
        prop: 'city',
        label: 'Tỉnh/Thành phố',
        type: 'select',
        validate: 'required',
    },
    {
        prop: 'manager ',
        label: 'Người phụ trách',
        type: 'text',
        validate: 'required',
    },
  ],
  
}
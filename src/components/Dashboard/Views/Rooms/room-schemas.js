export default [
  {
    prop: "id",
    label: "id",
    type: "number"
  },
  {
    prop: "title",
    label: "title",
    type: "text",
    searchable: true,
    minWidth: 120
  },
  {
    prop: "group_course",
    label: "Lớp học",
    type: "text",
    minWidth: 120
  },
  {
    prop: "status",
    label: "status",
    type: "badge"
  },
  {
    prop: "updated_at",
    label: "updated_at",
    minWidth: 150,
    type: "date"
  }
];

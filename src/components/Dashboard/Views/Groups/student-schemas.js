export default [
  {
    prop: "id",
    label: "id",
    type: "number"
  },
  {
    prop: "code",
    label: "code",
    type: "text",
    searchable: true,
    minWidth: 120
  },
  {
    prop: "name",
    label: "name",
    type: "text",
    searchable: true,
    minWidth: 120
  },
  {
    prop: "email",
    label: "email",
    type: "text",
    searchable: true,
    minWidth: 120
  },
  {
    prop: "phone",
    label: "phone",
    searchable: true,
    type: "text"
  },
  {
    prop: "success",
    label: "status",

    type: "badge"
  },
  {
    prop: "created_at",
    label: "createdAt",
    type: "datetime",
    minWidth: 120
  }
];

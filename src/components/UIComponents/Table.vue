<template>
  <div class="row m-0">
    <div class="col-sm-12 wrapper-table">
      <el-dropdown
        v-if="checkSelect"
        :style="dwStyle"
        class="dropdown-check-table"
      >
        <el-button type="primary" :style="{ width: dwStyle.width }">
          ({{ checkSelect }}) {{ $t(`el.pageTitle.${pageTitle}`) }}
          {{ $t(`el.table.selected`) }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu
          :style="{ width: dwStyle.width }"
          class="dropdown-status-table"
          slot="dropdown"
          v-if="actionsTable && actionsTable.length"
        >
          <el-dropdown-item
            v-for="(actionTable, index) of actionsTable"
            @click="actionTable.callback(multipleSelection)"
            :key="'action' + index"
          >
            <el-button
              @click="actionTable.callback(multipleSelection)"
              type="text"
              class="full-width text-left"
              :class="actionTable.color"
              :key="'btn' + index"
              >{{ $t(`el.button.${actionTable.title}`) }}</el-button
            >
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-table
        class="eye-table"
        :data="queriedData"
        border
        :row-key="rowKey"
        default-expand-all
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        :summary-method="getSummaries"
        :show-summary="summary ? summary.isSummary : false"
      >
        <el-table-column
          type="selection"
          width="45"
          v-if="checkAction"
          fixed="left"
          class-name="bg-white"
          :selectable="selectable"
        ></el-table-column>
        <el-table-column
          v-for="(column, index) in tableColumns"
          :key="index"
          :min-width="column.minWidth"
          :prop="column.prop"
          :sortable="column.sortable"
          :label="$t(`el.tableHeader.${column.label}`)"
          :fixed="index == 0 ? 'left' : false"
        >
          <template slot-scope="props">
            <span v-if="column.type === 'image'" align="center">
              <div v-if="props.row[column.prop]">
                <router-link
                  v-if="column.link"
                  :to="column.link + '/' + props.row['id']"
                >
                  <img
                    class="img-table"
                    :src="getImageSrc(props.row[column.prop], column.size)"
                  />
                </router-link>
                <template v-else-if="column.popover == true">
                  <el-popover
                    :placement="column.placement || 'left'"
                    width="300"
                    height="300"
                    trigger="hover"
                  >
                    <div class="popover-img">
                      <img :src="getImageSrc(props.row[column.prop], 'src')" />
                    </div>
                    <img
                      slot="reference"
                      class="img-table"
                      :src="getImageSrc(props.row[column.prop])"
                    />
                  </el-popover>
                </template>
                <img
                  v-else-if="column.externalLink"
                  class="img-table"
                  :src="getImageSrc(props.row[column.prop])"
                />
                <img
                  v-else
                  class="img-table"
                  :src="getImageSrc(props.row[column.prop])"
                />
              </div>
              <div v-else>
                <img class="img-table" :src="noImage" />
              </div>
            </span>
            <span
              v-else-if="column.prop === 'actionText'"
              v-html="props.row[column.prop]"
            ></span>
            <span v-else-if="column.type === 'number'">
              <router-link
                v-if="column.link"
                :to="column.link + '/' + props.row['id']"
                >{{ $util.formatNumber(props.row[column.prop]) }}</router-link
              >
              <span v-else>{{
                $util.formatNumber(props.row[column.prop])
              }}</span>
            </span>
            <span v-else-if="column.type === 'select'">
              <badge
                v-if="$util.parseType(column.prop, props.row[column.prop])"
                :type="$util.parseType(column.prop, props.row[column.prop])"
              >
                {{ parseStatus(column.prop, props.row[column.prop]) }}
              </badge>
              <span v-else>
                {{ parseStatus(column.prop, props.row[column.prop]) }}
              </span>
            </span>
            <span v-else-if="column.type === 'badge'">
              <badge :type="props.row['type'] || 'default'">{{
                props.row[column.prop]
              }}</badge>
            </span>
            <span v-else-if="column.type === 'html'">
              <span v-html="props.row[column.prop]"></span>
            </span>
            <span v-else-if="column.type === 'money'">
              <span v-if="props.row[column.prop]">{{
                $util.formatVndShort(props.row[column.prop])
              }}</span>
            </span>
            <span v-else-if="column.type === 'date'">
              <span>{{
                props.row[column.prop] &&
                  $util.formatDate(props.row[column.prop])
              }}</span>
            </span>
            <span v-else-if="column.type === 'datetime'">
              <span>{{
                props.row[column.prop] &&
                  $util.formatDateTime(props.row[column.prop])
              }}</span>
            </span>
            <span v-else-if="column.type === 'action'">
              <el-switch
                v-model="props.row[column.prop]"
                @input="val => column.callback(props.$index, props.row)"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </span>
            <span v-else>
              <router-link
                v-if="column.link"
                :to="
                  column.link +
                    '/' +
                    (column.propLink
                      ? props.row[column.propLink]
                      : props.row['id'])
                "
                :target="column.blank ? '_blank' : ''"
              >
                {{ props.row[column.prop] }}
              </router-link>
              <span v-else>{{ props.row[column.prop] }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="actions && actions.length"
          fixed="right"
          align="center"
          class-name="td-actions"
          :width="width.action"
          :label="$t('el.tableHeader.actions')"
        >
          <template slot-scope="props">
            <div v-if="!ignoreActions || !ignoreActions(props.row)">
              <p-button
                v-for="(action, i) in actions"
                size="sm"
                icon
                :type="action.type"
                :key="action.type + i"
                :title="$t(`el.button.${action.title}`)"
                :disabled="
                  action.disabled && action.disabled(props.$index, props.row)
                "
                @click="action.callback(props.$index, props.row)"
              >
                <i :class="action.icon"></i>
              </p-button>
            </div>
            <div v-else-if="parentActions && parentActions.length">
              <p-button
                v-for="(action, i) in parentActions"
                size="sm"
                icon
                :type="action.type"
                :key="action.type + i"
                :title="$t(`el.button.${action.title}`)"
                :disabled="
                  action.disabled && action.disabled(props.$index, props.row)
                "
                @click="action.callback(props.$index, props.row)"
              >
                <i :class="action.icon"></i>
              </p-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="col-sm-4">
      <el-select v-model="pagination.perPage" placeholder="Per page">
        <el-option
          class="select-default"
          v-for="item in pagination.perPageOptions"
          :key="item"
          :label="$t('el.table.perpageText', [item])"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <div class="col-sm-4 pagination-info">
      <p class="text-entries text-center">
        {{ $t("el.table.paginationText", [from, to, total]) }}
      </p>
    </div>
    <div class="col-sm-4">
      <p-pagination
        class="pull-right"
        v-model="pagination.currentPage"
        :per-page="pagination.perPage"
        :total="pagination.total"
      ></p-pagination>
    </div>
  </div>
</template>
<script>
import {
  Table,
  TableColumn,
  Select,
  Option,
  Dropdown,
  Button,
  DropdownMenu,
  DropdownItem,
  Popover,
  Switch
} from "element-ui";
import Badge from "./Badge.vue";
import PPagination from "src/components/UIComponents/Pagination.vue";
import { mapState } from "vuex";

export default {
  props: [
    "actions",
    "ignoreActions",
    "actionsTable",
    "columnDefs",
    "dataRows",
    "noSort",
    "selectable",
    "rowKey",
    "summary",
    "parentActions"
  ],
  components: {
    ElTable: Table,
    ElSelect: Select,
    ElOption: Option,
    ElButton: Button,
    ElSwitch: Switch,
    ElPopover: Popover,
    ElDropdown: Dropdown,
    ElTableColumn: TableColumn,
    ElDropdownMenu: DropdownMenu,
    ElDropdownItem: DropdownItem,
    PPagination,
    Badge
  },
  computed: {
    ...mapState(["pageTitle"]),
    pagedData() {
      return this.tableData.slice(this.from, this.to);
    },
    tableData() {
      return this.dataRows;
    },
    width() {
      let actionWidth = 0;
      if (this.actions && this.actions.length) {
        actionWidth = Math.max(this.actions.length * 45 + 20, 90);
      }
      return {
        action: actionWidth
      };
    },
    /***
     * Searches through table data and returns a paginated array.
     * Note that this should not be used for table with a lot of data as it might be slow!
     * Do the search and the pagination on the server and display the data retrieved from server instead.
     * @returns {computed.pagedData}
     */
    queriedData() {
      if (!this.searchQuery) {
        console.log("this.tableData", this.tableData);
        this.pagination.total = this.tableData.length;
        return this.pagedData;
      }
      let result = this.tableData.filter(row => {
        let isIncluded = false;
        for (let key of this.propsToSearch) {
          console.log("row[key]", row[key]);
          let rowValue = row[key].toString();
          if (rowValue.includes && rowValue.includes(this.searchQuery)) {
            isIncluded = true;
          }
        }
        return isIncluded;
      });
      this.pagination.total = result.length;
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      this.pagination.total = this.tableData.length;
      return this.tableData.length;
    },
    checkSelect() {
      return this.multipleSelection.length;
    },
    checkAction() {
      if (!this.actionsTable) return false;
      return this.actionsTable.length;
    },
    host() {
      return process.env.VUE_APP_API_BASE_URL;
    },
    checkSort() {
      return this.noSort ? false : "custom";
    }
  },
  data() {
    return {
      noImage: "/static/img/no-image.png",
      pagination: {
        perPage: 10,
        currentPage: 1,
        perPageOptions: [10, 25, 50, 100],
        total: 0
      },
      searchQuery: "",
      propsToSearch: this.columnDefs.map(col => col.prop),
      tableColumns: this.columnDefs,
      multipleSelection: [],
      dwStyle: {
        left: 0,
        width: 0
      }
    };
  },
  mounted() {
    window["TBL"] = this;
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      const defaultIndex = this.summary ? this.summary.index || 1 : 1;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t("el.tableHeader.totalPrice") + ":";
          return;
        }
        if (index != defaultIndex) return;
        sums[index] = this.$util.formatNumber(
          this.summary ? this.summary.total : 0
        );
      });
      return sums;
    },
    parseStatus(prop, value) {
      let title = this.$util.parseStatus(prop, value);
      return this.$t(`el.selectOptions.${title}`);
    },
    handleLike(index, row) {
      alert(`Your want to like ${row.name}`);
    },
    handleEdit(index, row) {
      alert(`Your want to edit ${row.name}`);
    },
    handleDelete(index, row) {
      let indexToDelete = this.tableData.findIndex(
        tableRow => tableRow.id === row.id
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;

      let elTable = this.$el.getElementsByClassName("el-table")[0];
      let table = elTable.getElementsByTagName("table")[0];
      let ths = table.getElementsByTagName("th");

      let left = ths[0].offsetWidth;
      let width = ths[1].offsetWidth + ths[2].offsetWidth;

      this.dwStyle.left = left + 15 + 5 + "px";
      this.dwStyle.width = width - 10 + "px";
    },
    sortChange(column, prop, order) {
      this.$emit("sortChange", column);
    },
    updateColumns(columns) {
      this.tableColumns = columns;
    },
    getImageSrc(image, size = "medium") {
      let url = this.noImage;
      if (image) {
        url = typeof image === "string" ? image : image[size];
        if (!url.includes("http")) {
          url = this.host + image[size];
        }
      }
      return url;
    }
  }
};
</script>
<style lang="scss">
.el-table {
  .td-actions {
    background-color: white !important;
    button.btn {
      margin-right: 5px;
    }
  }
  .el-table__row td {
    padding: 5px !important;
  }
}

.text-entries {
  line-height: 46px;
}
.dropdown-check-table {
  position: absolute;
  top: 8px;
  left: 50px;
  z-index: 999;
}
.dropdown-status-table {
  min-width: 200px;
}
.img-table {
}
</style>

<style lang="scss">
.el-table table > thead > tr > th,
.el-table table > tbody > tr > th,
.el-table table > tfoot > tr > th,
.el-table table > thead > tr > td,
.el-table table > tbody > tr > td,
.el-table table > tfoot > tr > td {
  div {
    max-height: 65px;
    overflow-y: auto !important;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  padding: 5px;
  margin: 0;
  .img-table {
    max-height: 65px;
  }
}
.el-table__row.expanded td:first-child .cell {
  display: flex;
  align-items: center;
  .el-table__expand-icon {
    margin-right: 10px;
  }
}

.p-badge,
.p-badge:focus,
.p-badge:hover {
  white-space: nowrap;
}

.wrapper-table {
  margin: 15px 0;
}
</style>

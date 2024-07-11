import _ from 'lodash';
import util from '../helpers/util'

export default {
  buildRules(schemas) {
    let arr = [];
    for (let x of schemas) {
      if (!x.searchable) continue;
      if (x.type === 'image') continue;

      let obj = {
        name: x.label || x.name,
        value: x.prop,
        type: x.type
      }

      switch (x.type) {
        case 'text':
          obj = Object.assign(obj, {
            ops: [
              {name: 'el.filter.contain', value: '&='},
              {name: 'el.filter.notContain', value: '!='},
              {name: 'el.filter.equal', value: '=='},
              {name: 'el.filter.startWith', value: '=%'},
              {name: 'el.filter.endWith', value: '%='},
              {name: 'el.filter.isEmpty', value: 'empty' }
            ]
          })
          break;
        case 'date':
        case 'number':
        case 'money':
          obj = Object.assign(obj, {
            ops: [
              {name: 'el.filter.greater', value: '>'},
              {name: 'el.filter.greaterOrEqual', value: '>='},
              {name: 'el.filter.less', value: '<'},
              {name: 'el.filter.lessOrEqual', value: '<='},
              {name: 'el.filter.equal', value: '=='},
            ]
          });
          break;
        case 'select':
          obj = Object.assign(obj, {
            ops: [ {name: 'el.filter.equal', value: '=='} ],
            values: util.getOptions(x.prop)
          });
          break;
      }
      arr.push(obj);
    }
    return arr;
  },

  buildColumDefs(schemas) {
    return schemas.map(x => {
      let r = Object.assign({}, x);
      // if (r.type == 'select' && r.prop != 'role') {
      //   r.type = 'badge'
      // }
      return r;
    })
  },

  buildInitFields(schemas, initFiledArrays){
    let fields = schemas.map(item => ({
      ...item,
      active: _.includes(initFiledArrays, item.prop),
      type: item.type
      // type: (item.type == 'select' && item.prop != 'role') ? 'badge' : item.type
    }));

    return fields;
  },
  filterByRules(rows, rules) {
    let pRow = JSON.parse(JSON.stringify(rows));
    const self = this;
    if (rules.length) {
      for (let rule of rules) {
        pRow = pRow.filter(function(row) {
          const fChildren = self.filterByRules(row.children || [], rules);
          if (fChildren && fChildren.length > 0) {
            row.children = fChildren;
            return true;
          }
          if (rule.type === 'number' || rule.type === 'money') {
            let equation = 'row.' + rule.filter + rule.ope + rule.value;
            let fs = eval(equation);
            return fs;
          }
          if (rule.type === 'date') {
            let equation = `new Date(row.${rule.filter}) ${rule.ope} new Date('${rule.value}')`;
            let fs = eval(equation);
            return fs;
          }
          if (rule.type === 'text' || rule.type === 'select') {
            let fs = true;
            let value = rule.value && rule.value.toString() || '';
            if (!row[rule.filter]) return false
            let cell_filter = row[rule.filter].toString();
            switch (rule.ope) {
              case '&=':
                fs = cell_filter.toLowerCase().indexOf(value.toLowerCase()) > -1;
                break;
              case '!=':
                fs = cell_filter.toLowerCase().indexOf(value.toLowerCase()) == -1;
                break;
              case '=%':
                fs = cell_filter.toLowerCase().startsWith(value.toLowerCase());
                break;
              case '%=':
                fs = cell_filter.toLowerCase().endsWith(value.toLowerCase());
                break;
              case 'empty':
                fs = cell_filter === '' || cell_filter === null || cell_filter === undefined || cell_filter === '0' || cell_filter === 'N/A';
                break;
              case '==':
                fs = cell_filter.toLowerCase() == value.toLowerCase();
                break;
              default:
                break;
            }
            return fs;
          }
          return true;
        })
      }
    }
    return pRow;
  },

  buildQueryString(rules) {
    let queryString = '';
    let arr = [];
    if (rules.length) {
      for (let rule of rules) {
        if (rule.ope == '&=') rule.ope = '**';
        arr.push(`${rule.filter}${rule.ope}${rule.value}`);
      }
      queryString = arr.join('&');
    }
    return queryString;
  }
}

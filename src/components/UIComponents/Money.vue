<template>
  <div
    class="money el-input"
    :class="{'is-disabled':disabled,'el-input-group el-input-group--append el-input-group--prepend':!!$slots.append}">
    <div
      v-if="!!$slots.prepend"
      class="el-input-group__prepend">
      <slot name="prepend"></slot>
    </div>
    <input
      ref="ipt"
      autocomplete="off"
      type="text"
      rows="2"
      :disabled="disabled"
      validateevent="true"
      class="el-input__inner"
      v-model="val"
      :placeholder="placeholder"
    >
    <div
      v-if="!!$slots.append"
      class="el-input-group__append">
      <slot name="append"></slot>
    </div>
  </div>
</template>
<script>
  import {Input} from 'element-ui'

  export default {
    components: {
      ElInput: Input
    },
    props: {
      value: {
        required: false,
        'default': ''
      },
      disabled: {
        type: Boolean,
        required: false,
        'default': false
      },
      fixed: {
        required: false,
      },
      placeholder: {
        required: false,
        'default': ''
      }
    },
    computed: {
      val: {
        get() {
          return formatNumber.call(this, this.value, this.fixed  - 0|| 0)
        },
        set(v) {
          const fixed = this.fixed - 0 || 0;
          const val = this.value
          const fix1 = v.replace(/[^0-9.,]/g, '')
          const fix2 = v.replace(/,/g, '')
          const fix3 = parseFloat(parseFloat(fix2).toFixed(fixed))
          const nan = isNaN(fix3)
          if (fix1 !== v || nan || val === fix3) {
            return formatNumber.call(this, this.value, fixed)
          } else if (!nan) {
            this.$emit('input', fix3)
            this.$emit('change', fix3)
          }
        }
      }
    }
  }

  function formatNumber(value, number) {
    let range
    const ipt = this.$refs['ipt'];
    const fixed = this.fixed - 0 || 0;
    if (value === undefined) {
      return value
    } else {
      let [a, b = ''] = (value + '').split(/(?=\.)/);
      let x = a.length % 3;
      range = a.substr(0, x)
        + a.substr(x).replace(/(\d{3})/g, ',$1').substr(+!x)
      if (number) range += (+(0 + b)).toFixed(number).substr(1)
      else if (b) range += b.substr(0, fixed + 1)
    }
    if (ipt) {
      let st = -1
      if (document.activeElement === ipt) {
        const val = ipt.value + ''
        if (val === '' || /^\.0*$/g.test(val)) {
          this.$emit('input', '')
          this.$emit('change', '')
          return ''
        }
        const point = val.indexOf('.')
        const l0 = val.length
        const l1 = range.length
        const fix = l1 - l0;
        const s0 = ipt.selectionStart
        const s1 = ipt.selectionEnd
        if (point !== -1 && s0 > point)
          st = s0 - fix + (
            fix > 0 ?
              s0 === s1 ?
                s0 - point === fix && fix === 1 ?
                  0 : 1
                : 2
              : -1
          )
        else {
          if (val.length === 1 && s0 === s1 && fix === fixed + 1) {
            st = 1
          } else st = s0 + fix
        }
      }
      ipt.value = range
      if (st !== -1) ipt.setSelectionRange(st, st)
    }
    return range
  }
</script>
<style lang="scss">
  div.el-input-group__append {
    width: 83px !important;
    max-width: 83px !important;
    text-align: center;
  }
</style>

<template>
  <component :is="baseComponent"
             :to="link.path ? link.path : '/'"
             :class="{active: isActive}"
             tag="li">
    <a v-if="isMenu"
       data-toggle="collapse"
       href="#"
       @click.prevent="collapseMenu"
    >
      <i :class="link.icon"></i>
      <p>{{$t(`el.sidebar.${link.name}`)}}
        <b class="caret" :class="{rotated: !collapsed}"></b>
      </p>
    </a>
    <collapse-transition v-if="$slots.default || this.isMenu">
      <div v-show="!collapsed" class="collapse-menu">
        <ul class="nav">
          <slot></slot>
        </ul>
      </div>
    </collapse-transition>
    <slot name="title" v-if="children.length === 0 && !$slots.default && link.path">
      <component
        :to="link.path"
        :is="elementType(link, false)"
        :class="{active: link.active}"
        :target="link.target"
        @click.native.stop="onItemClick"
      >
        <template v-if="addLink">
          <span class="sidebar-mini-icon">&nbsp;</span>
          <span class="sidebar-normal">{{$t(`el.sidebar.${link.name}`)}}</span>
        </template>
        <template v-else>
          <i :class="link.icon"></i>
          <p>{{$t(`el.sidebar.${link.name}`)}}</p>
        </template>
      </component>
    </slot>
  </component>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions';

  export default {
    components: {
      CollapseTransition
    },
    props: {
      menu: {
        type: Boolean,
        default: false,
        description: 'Whether item is a menu containing multiple items'
      },
      link: {
        type: Object,
        default: () => {
          return {
            name: '',
            path: '',
            children: []
          }
        },
        description: 'Link object'
      }
    },
    provide() {
      return {
        addLink: this.addChild,
        removeLink: this.removeChild
      }
    },
    inject: {
      addLink: { default: null },
      removeLink: { default: null },
      autoClose: { default: false },
    },
    data() {
      return {
        children: [],
        collapsed: true
      }
    },
    computed: {
      baseComponent() {
        return this.isMenu || this.link.isRoute ? 'li' : 'router-link'
      },
      isMenu() {
        return this.children.length > 0 || this.menu === true
      },
      isActive() {
        if (this.$route) {
          let matchingRoute = this.children
            .find((c) => this.$route.path.startsWith(c.link.path))
          if (matchingRoute !== undefined) {
            return true
          }
        }
        return false
      }
    },
    methods: {
      addChild(item) {
        const index = this.$slots.default.indexOf(item.$vnode)
        this.children.splice(index, 0, item)
      },
      removeChild(item) {
        const tabs = this.children
        const index = tabs.indexOf(item)
        tabs.splice(index, 1)
      },
      elementType(link, isParent = true) {
        if (link.isRoute === false) {
          return isParent ? 'li' : 'a'
        } else {
          return 'router-link'
        }
      },
      collapseMenu() {
        this.collapsed = !this.collapsed;
        if (!this.collapsed) {
          this.$root.$emit('menuItemOpen', this.link);
        }
      },
      onItemClick() {
        if(this.autoClose) {
          this.$sidebar.showSidebar = false;
        }
      }
    },
    mounted() {
      let self = this;
      this.$root.$on('menuItemOpen', function(link) {
        if (self.link.name != link.name) {
          self.collapsed = true;
        }
      })
      if (this.addLink) {
        this.addLink(this)
      }
      if (this.link.collapsed !== undefined) {
        this.collapsed = this.link.collapsed
      }
      if (this.isActive && this.isMenu) {
        this.collapsed = false
      }
    },
    watch: {
      isActive(newValue, oldValue) {
        if (newValue) this.collapsed = false;
        else this.collapsed = true;
      }
    },
    destroyed() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el)
      }
      if (this.removeLink) {
        this.removeLink(this)
      }
    }
  }
</script>
<style scoped>
  .caret.rotated {
    transform: rotate(180deg);
  }
</style>

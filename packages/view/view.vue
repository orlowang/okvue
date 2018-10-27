<template>
    <div :style="{
        display: inline === '' ? 'inline-flex': 'flex',
        flexDirection: column === '' ? 'column': ( column || 'row'),
        flex: flex === '' ? 1 : flex,
        width: full === '' ? '100%' : w,
        height: full === '' ? '100%' : h,
        justifyContent: !column() ? (hor === '' ? 'center' : hor) : (ver === '' ? 'center' : ver),
        alignItems: !column() ? (ver === '' ? 'center' : ver) : (hor === '' ? 'center' : hor)
    }">
        <slot></slot>
    </div>
</template>

<script>
/**
 * {props} ver<String> vertical   垂直排列
 * {props} hor<String> horizontal 水平排列
 * {props} col<Boolean> column
 */
export default {
  name: "o-view",
  props: {
    column: String,
    inline: String,
    flex: String,
    w: String,
    h: String,
    full: String,
    ver: String,
    hor: String
  },
  methods: {
    isColumn() {
      return column === "" || /column/.test(column);
    }
  }
};
</script>

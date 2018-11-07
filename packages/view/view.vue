<template>
    <div :style="{
        display: inline === '' ? 'inline-flex': 'flex',
        flexDirection: column === '' ? 'column': ( column || 'row'),
        flex: flex === '' ? 1 : flex,
        width: full === '' ? '100%' : w,
        height: full === '' ? '100%' : h,
        justifyContent: !isColumn() ? (hor === '' ? 'center' : hor) : (ver === '' ? 'center' : ver),
        alignItems: !isColumn() ? (ver === '' ? 'center' : ver) : (hor === '' ? 'center' : hor),
        overflow: ovef === '' ? 'hidden' : ovef,
        minWidth: minw,
        maxWidth: maxw,
        minHeight: minh,
        maxHeight: maxh
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
    hor: String,
    minw: String,
    maxw: String,
    minh: String,
    maxh: String,
    ovef: String
  },
  methods: {
    isColumn() {
      return this.column === "" || /column/.test(this.column);
    }
  }
};
</script>

<template>
    <div :style="{
        display: inline ? 'inline-flex': 'flex',
        flexDirection: (column === '' || column === true) ? 'column': ( column || 'row'),
        flex: flex === '' ? 1 : flex,
        width: full ? '100%' : w,
        height: full ? '100%' : h,
        justifyContent: !column ? ((hor === ''||hor === true) ? 'center' : hor) : ((ver === ''||ver === true) ? 'center' : ver),
        alignItems: !column ? ((ver === ''||ver === true) ? 'center' : ver) : ((hor === ''||hor === true) ? 'center' : hor)
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
    column: Boolean,
    inline: Boolean,
    flex: String,
    w: String,
    h: String,
    full: Boolean,
    ver: String,
    hor: String
  }
};
</script>

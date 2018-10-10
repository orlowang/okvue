<template>
    <div :style="{
        display: inline ? 'inline-flex': 'flex',
        flexDirection: col ? 'column': 'row',
        flex: f === '' ? 1 : f,
        width: w === '' ? '100%' : w,
        height: h === '' ? '100%' : h,
        justifyContent: !col ? (hor === '' ? 'center' : hor) : (ver === '' ? 'center' : ver),
        alignItems: !col ? (ver === '' ? 'center' : ver) : (hor === '' ? 'center' : hor)
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
    col: Boolean,
    inline: Boolean,
    f: Boolean,
    w: String,
    h: String,
    ver: String,
    hor: String
  }
};
</script>

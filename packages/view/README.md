# View

**view** is vue component which has flex-like layout

## how to use

```
import View from "@okvue/view"
Vue.use(View)
```

props|info|value
|-|-|-
hor|horizontal arrangement|null for *center*, or [start, end, ...]
ver|vertical arrangement|null for *center*, or [start, end, ...]
col|column direction|null
inline|keep inline style|null

## example

```
<o-view hor>
    child which inside will stay horizontally centered
</o-view>
```
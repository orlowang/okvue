# vue-fetch

simple data fetch for vue(x)

> use with **vuex**

## how to use

```
import vuefetch from "@okvue/vue-fetch"
Vue.use(vuefetch)

// config for fetch client
new Vue({
    fetch: {
        backend: 'https://path/to/api',
        api: {
            repos: 'repos',
            projs: 'projects'
        }
    }
    ...
})

// in vue component
export default {
    created() {
        this.$fetch('repos').then(data => {
            // todo with data
        });
    }
};
```

## feature

### fetch options
```
new Vue({
    fetch: {
        method: 'post',
        headers: {
            "content-type": "javascript/json"
        }
        ...
    }
    ...
})
```
or
```
export default {
    created() {
        this.$fetch('repos', {
            method: 'post',
            headers: {
                "content-type": "javascript/json"
            }
            ...
        }).then(data => {
            // todo with data
        });
    }
};
```

### multiple fetch
```
export default {
    created() {
        this.$fetch(['repos', 'projs']).then(data => {
            // todo with data
        });
    }
};
```

### fetch status
```
export default {
    created() {
        this.$fetch('repos').then(data => {
            // todo with data
        });
    }
    // you can use computed or just use {{this.$store.getters.repos}}
    computed: {
        reposStatus(){
            return this.$store.getters.repos
        }
    }
};
```

### query
```
export default {
    created() {
        this.$fetch({
            url: 'repos',
            query: {
                author: 'owcc'
                ...
            }
        }).then(data => {
            // todo with data
        });
    }
};
```

### post data
> not allow to multiple post *for now*
```
export default {
    created() {
        this.$fetch('repos', {
            name: 'name',
            other: 'other'
        }).then(data => {
            // todo with data
        });
    }
};
```
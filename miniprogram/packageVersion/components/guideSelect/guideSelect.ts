// packageVersion/components/guideSelect/guideSelect.ts
Component({

    data: {
        show: true,
        canHide: false
    },
    lifetimes: {
        ready() {
            setTimeout(() => {
                this.setData({
                    canHide: true
                })
            }, 3000)
        }
    },
    methods: {
        hide() {
            if (this.data.canHide){
                this.setData({
                    show: false
                })
                this.triggerEvent("finish")
            }
        }
    }
})
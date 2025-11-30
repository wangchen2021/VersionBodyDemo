// components/showVideoList/showVideoList.ts
Component({

    data: {
        imgs: [
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192347.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192338.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192327.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192321.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192338.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192327.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192321.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192338.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192327.png",
            "https://cos.painspective.com/jizhi/miniProgram/public/index/20240415-192321.png",
        ],
        selectIndex: -1
    },
    lifetimes: {
        attached() {
            setTimeout(() => {
                const timer = setInterval(() => {
                    this.setData({
                        selectIndex: this.data.selectIndex + 1
                    })
                    if (this.data.selectIndex === this.data.imgs.length - 2) {
                        clearInterval(timer)
                    }
                }, 150)
            }, 1500)
        }
    }
})
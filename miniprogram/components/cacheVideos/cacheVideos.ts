// components/cacheVideos/cacheVideos.ts
Component({

    data: {
        videos: <string[]>[],
        currentVideoIndex:0
    },

    methods: {
        setCacheVideos(videos: string[]) {
            this.setData({
                videos,
                currentVideoIndex:0
            })
        },
        loadedFinished(){
            if(this.data.currentVideoIndex<(this.data.videos.length-1)){
                this.setData({
                    currentVideoIndex:this.data.currentVideoIndex+1
                })
            }else{
                this.triggerEvent("finish")
            }
        }

    }
})
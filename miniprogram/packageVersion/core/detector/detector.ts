//https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/visionkit/body.html
import { NeckBendFilter, NeckRotateFilter } from "../angle/angleCompute"

export type pointsData = {
    points: Array<points2d>,
    points3d: Array<points3d>,
    origin: points2d,
    size: any
}

export default class Detector {
    private cameraCtx!: WechatMiniprogram.CameraContext
    private VKsession!: WechatMiniprogram.VKSession
    private cameraListener!: WechatMiniprogram.CameraFrameListener
    detectType!: detectType
    frameWidth!: number
    frameHeight!: number
    fps!: number
    detectTime!: number
    neckAngle = new NeckBendFilter()
    neckRotate = new NeckRotateFilter()

    init(type: detectType = "body") {
        this.detectType = type
        return new Promise(async (reslove, reject) => {

            await this.stop()
            console.log("detector_mode:", type);
            if (type === "body") {
                this.VKsession = wx.createVKSession({
                    track: {
                        plane: { mode: 1 },
                        body: { mode: 2 },
                    },
                    version: "v1"
                })
            }

            if (type === "face") {
                this.VKsession = wx.createVKSession({
                    track: {
                        plane: { mode: 1 },
                        face: { mode: 2 }
                    },
                    version: "v1"
                })
            }

            this.VKsession.start((err: any) => {

                if (err) {
                    reject(err)
                    return console.error('VK error: ', err)
                }

                console.log("session start");

                this.VKsession.on('updateAnchors', (anchors: any) => {
                    if (this.fps) {
                        let fpsInterval = 1000 / this.fps
                        let now = Date.now()
                        let difTime = now - this.detectTime
                        if (difTime < fpsInterval) return
                    }
                    const data = anchors.map((anchor: any) => {
                        return {
                            points: anchor.points,
                            origin: anchor.origin,
                            size: anchor.size,
                            angle: anchor.angle,
                            camExtArray: anchor.camExtArray,
                            camIntArray: anchor.camIntArray
                        }
                    })
                    this.setPointsData(data)
                })

                this.VKsession.on('removeAnchors', () => {
                    console.log('removeAnchors')
                    this.setPointsData(null)
                })

                this.cameraCtx = wx.createCameraContext()
                this.cameraListener = this.cameraCtx.onCameraFrame((frame: WechatMiniprogram.OnCameraFrameCallbackResult) => {
                    const detectParam: any = {
                        frameBuffer: frame.data, // 图片 ArrayBuffer 数据。待检测图像的像素点数据，每四项表示一个像素点的 RGBA
                        width: frame.width, // 图像宽度
                        height: frame.height, // 图像高度
                        scoreThreshold: 0.6, // 评分阈值
                        sourceType: 0,//图片来源， 默认为1， 0表示输入图片来自于视频的连续帧
                    }

                    if (this.detectType === "body") {
                        this.VKsession.detectBody(detectParam)
                    }

                    else if (this.detectType === "face") {
                        this.VKsession.detectFace(detectParam)
                    }
                })
                reslove(true)
            })
        })
    }

    setFps(fps: number) {
        this.fps = fps
    }

    start() {
        this.cameraListener.start()
    }

    stop() {
        return new Promise((reslove, reject) => {
            this.cameraListener?.stop({
                fail: (err: any) => {
                    console.error(err);
                    reject(err)
                }
            })
            setTimeout(() => {
                this.VKsession?.destroy()
                reslove(true)
            })
        })
    }

    private setPointsData(data: any) {
        this.detectTime = Date.now()
        this.bindDetect(data)
    }

    bindDetect(_data: any) { }
}
const dpr = wx.getSystemInfoSync().pixelRatio
const rpx = dpr * wx.getSystemInfoSync().windowWidth / 750
/**
 * @author Wang Chen
 * @description 角度渲染线程
 */
export default class AngleRender {
    canvas!: WechatMiniprogram.Canvas;
    ctx!: CanvasRenderingContext2D;
    width!: number;
    height!: number;
    angle: number = 0
    angles:number[]=[]
    maxValue!: number
    progress: number = 0
    fps = 30
    loopRotate: number = 0
    rotateSpeed = Math.PI / 30
    finishProgress = 0
    finishProgressSpeed = 0.01
    result: any[] = []
    rotateLoopShowProgress = 1
    pointer!: any
    flashLoop = 0
    flashLoopSpeed = 1 / 15
    sampleInterval = 17
    sampleRes: number[] = []
    startTimer = false
    timerFont = 68
    timerStr = ""
    realAngle = 0;
    init(query: WechatMiniprogram.SelectorQuery, canvasId: string) {
        return new Promise((reslove, reject) => {
            query.select(`#${canvasId}`)
                .fields({ node: true, size: true })
                .exec((res) => {
                    const canvas = res[0].node
                    if (!canvas) reject(false)
                    this.canvas = canvas
                    this.ctx = canvas.getContext('2d')
                    const dpr = wx.getSystemInfoSync().pixelRatio
                    canvas.width = res[0].width * dpr
                    canvas.height = res[0].height * dpr
                    this.width = canvas.width
                    this.height = canvas.height
                    let img: any = canvas.createImage();
                    img.src = 'https://cos.painspective.com/jizhi/miniProgram/public/20240328-193707.png';
                    img.onload = () => {
                        this.pointer = img
                        reslove(true)
                    }
                })
        })
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    reset() {
        this.sampleRes = []
        this.startTimer = false
        this.timerFont = 68
        this.result = []
        this.progress = 0
        this.angle = 0
        this.finishProgress = 0
        this.rotateLoopShowProgress = 1
    }

    catchSamples() {
        if (this.finishProgress >= 0.2 && this.result.length === 0) {
            this.result.push(this.angle)
        }
        if (this.finishProgress >= 0.5 && this.result.length === 1) {
            this.result.push(this.angle)
        }
        if (this.finishProgress >= 0.8 && this.result.length === 2) {
            this.result.push(this.angle)
        }
        if (this.finishProgress >= 1 && this.result.length === 3) {
            this.result.push(this.angle)
        }
    }

    drawBottomRemainTime(value: number) {
        const startX = 0.2 * this.width
        const startY = 0.94 * this.height
        const length = this.width - 2 * startX
        const ctx = this.ctx
        ctx.lineCap = "round"
        ctx.strokeStyle = "#D4E2F2"
        ctx.lineWidth = 24 * rpx
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX + length, startY)
        ctx.stroke()
        ctx.closePath()
        ctx.strokeStyle = "#4C9EFB"
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX + length * value, startY)
        ctx.stroke()
        ctx.closePath()
    }

    outputResult(_result: number[]) { }

}
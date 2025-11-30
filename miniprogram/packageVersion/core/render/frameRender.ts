/**
 * @author Wang Chen
 * @description 人体关键点渲染线程
 */
export default class FrameRender {
    ctx!: CanvasRenderingContext2D;
    width!: number;
    height!: number;
    init(query: WechatMiniprogram.SelectorQuery, canvasId: string) {
        return new Promise((reslove, _reject) => {
            query.select(`#${canvasId}`)
                .fields({ node: true, size: true })
                .exec((res) => {
                    const canvas = res[0].node
                    this.ctx = canvas.getContext('2d')
                    const dpr = wx.getSystemInfoSync().pixelRatio
                    canvas.width = res[0].width * dpr
                    canvas.height = res[0].height * dpr
                    this.width = canvas.width
                    this.height = canvas.height
                    reslove(true)
                })
        })
    }
    
    renderBodyFrame(data: any) {
        this.ctx.clearRect(0, 0, this.width, this.height)
        if (!data) {
            return
        }
        const points = data[0].points
        const size = data[0].size
        const origin = data[0].origin
        const midPoint = { x: (points[6].x + points[5].x) / 2, y: (points[6].y + points[5].y) / 2 }
        this.renderFrameRect(origin, size)
        this.renderFramePoint(points)
        this.renderFrameLine([points[4], points[2], points[0], midPoint, points[6], points[8], points[10], points[18]])
        this.renderFrameLine([points[0], points[1], points[3]])
        this.renderFrameLine([midPoint, points[5], points[7], points[9], points[17]])
        this.renderFrameLine([midPoint, points[12], points[14], points[16]])
        this.renderFrameLine([midPoint, points[11], points[13], points[15]])
        this.renderFrameLine([points[12], points[11]])
    }

    renderFaceFrame(data: any) {
        this.ctx.clearRect(0, 0, this.width, this.height)
        if (!data) {
            return
        }
        const points = data[0].points
        const size = data[0].size
        const origin = data[0].origin
        this.renderFramePoint([points[45], points[0], points[32], points[16]])
        this.renderFrameLine([points[0], points[45], points[16], points[45], points[32]])
        this.renderFrameRect(origin, size)
    }

    private renderFrameRect(origin: points2d, size: { width: number, height: number }) {
        this.ctx.lineWidth = this.width * 0.01
        this.ctx.strokeStyle = "green"
        this.ctx.strokeRect(origin.x * this.width, origin.y * this.height, size.width * this.width, size.height * this.height)
    }

    private renderFramePoint(renderPoints: points2d[]) {
        this.ctx.fillStyle = "#EC9B32"
        for (let point of renderPoints) {
            this.ctx.beginPath()
            this.ctx.arc(point.x * this.width, point.y * this.height, this.width * 0.03, 0, Math.PI * 2)
            this.ctx.fill()
            this.ctx.closePath()
        }
    }

    private renderFrameLine(renderPoints: points2d[]) {
        this.ctx.lineWidth = this.width * 0.01
        this.ctx.strokeStyle = "#EC9B32"
        this.ctx.beginPath()
        this.ctx.moveTo(renderPoints[0].x * this.width, renderPoints[0].y * this.height)
        for (let i = 1; i < renderPoints.length; i++) {
            const point = renderPoints[i]
            this.ctx.lineTo(point.x * this.width, point.y * this.height)
        }
        this.ctx.stroke()
        this.ctx.closePath()
    }
}
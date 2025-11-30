import AngleRender from "./angleRender"
import { drawArrow, drawSuccess, drawTimer } from "./shapeRender"
const dpr = wx.getSystemInfoSync().pixelRatio
const rpx = dpr * wx.getSystemInfoSync().windowWidth / 750
export default class DrawLoopTopLeft extends AngleRender implements drawAngle {
    private redis = 250 * rpx
    private centerX = 380 * rpx
    private centerY = 500 * rpx
    draw() {
        this.drawBottomLineShape()
        this.drawLineBack()
        if (this.progress < 1) {
            this.finishProgress = 0
            this.rotateLoopShowProgress = 1
            if (this.result.length < 4)
                this.result = []
            this.drawRotateLoop()
            this.drawBottomLoop()
            this.drawValueBack()
            this.drawValueShape()
        }
        else {
            if (this.rotateLoopShowProgress > 0) {
                this.rotateLoopShowProgress = this.rotateLoopShowProgress - 0.03
                this.drawRotateHideLoop()
                this.drawValueBack()
                this.drawValueShape()
            } else {
                this.drawValueBack()
                this.drawValueShape()
                this.drawFinishProgress()
            }
        }
    }

    setAngle(angle: number) {
        if (angle === 0 && this.result.length === 4) {
            this.outputResult(this.result)
            this.reset()
        }
        this.angle = angle
        this.progress = this.angle / this.maxValue
        this.progress = this.progress > 1 ? 1 : this.progress
        this.clear()
        this.draw()
    }

    drawBottomLineShape() {
        const ctx = this.ctx
        ctx.beginPath()
        const radialGradient = ctx.createLinearGradient(this.centerX, this.centerY - this.redis, this.centerX - this.redis, this.centerY);
        radialGradient.addColorStop(0, 'rgba(212, 212, 212, 0.00)'); // 起始颜色，从圆心开始
        radialGradient.addColorStop(0.65, '#CCD4E9'); // 中间颜色
        ctx.strokeStyle = radialGradient;
        ctx.lineWidth = 64 * rpx
        ctx.lineCap = "round"
        ctx.arc(this.centerX, this.centerY, this.redis, Math.PI, 3 / 2 * Math.PI)
        ctx.stroke()
        ctx.closePath()
    }

    drawLineBack() {
        const ctx = this.ctx
        const gradient = ctx.createLinearGradient(this.centerX, this.centerY - this.redis, this.centerX - this.redis, this.centerY);
        gradient.addColorStop(0, '#CCD4E9')
        gradient.addColorStop(0.35, '#A1AED2')
        gradient.addColorStop(0.76, "#CCD4E9")
        ctx.strokeStyle = gradient
        ctx.lineWidth = 64 * rpx
        ctx.beginPath()
        ctx.arc(this.centerX, this.centerY, this.redis, Math.PI, 3 / 2 * Math.PI)
        ctx.stroke()
        ctx.closePath()
    }

    drawBottomLoop() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.fillStyle = "#acc8e9"
        ctx.arc(this.centerX - this.redis, this.centerY, 60 * rpx, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }

    drawRotateLoop() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.setLineDash([2 * Math.PI * 77 * rpx / 24, 20 * rpx]);
        ctx.strokeStyle = "#609DE3"
        ctx.lineWidth = 10 * rpx
        ctx.lineCap = "round"
        ctx.save();
        ctx.translate(this.centerX - this.redis, this.centerY)
        ctx.rotate(this.loopRotate)
        ctx.translate(-this.centerX + this.redis, -this.centerY)
        ctx.arc(this.centerX - this.redis, this.centerY, 77 * rpx, 0, Math.PI * 2)
        ctx.stroke()
        ctx.closePath()
        ctx.restore()
        this.loopRotate = this.loopRotate + this.rotateSpeed
    }

    drawRotateHideLoop() {
        if (this.rotateLoopShowProgress < 0) return
        const ctx = this.ctx
        const start = 3 * Math.PI / 2
        const loopShowProgress = Math.PI * 2 * this.rotateLoopShowProgress
        ctx.beginPath()
        ctx.setLineDash([2 * Math.PI * 77 * rpx / 24, 20 * rpx]);
        ctx.strokeStyle = "#609DE3"
        ctx.lineWidth = 10 * rpx
        ctx.lineCap = "round"
        ctx.arc(this.centerX - this.redis, this.centerY, 77 * rpx, start + (Math.PI * 2 - loopShowProgress), start + Math.PI * 2)
        ctx.stroke()
        ctx.closePath()
    }

    drawValueBack() {
        const ctx = this.ctx
        const progressAngle = this.progress * Math.PI / 2
        ctx.strokeStyle = "#99C9FF"
        ctx.lineWidth = 64 * rpx
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.arc(this.centerX, this.centerY, this.redis, 3 / 2 * Math.PI, 3 / 2 * Math.PI - progressAngle, true)
        ctx.stroke()
        ctx.closePath()
    }

    drawValueShape() {
        const ctx = this.ctx
        const progressAngle = this.progress * Math.PI / 2
        const targetTop = this.centerY - this.redis * Math.cos(progressAngle)
        const targetLeft = this.centerX - this.redis * Math.sin(progressAngle)
        ctx.beginPath()
        ctx.fillStyle = "#39C0FF"
        ctx.shadowOffsetX = 5 * rpx;
        ctx.shadowOffsetY = 5 * rpx;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.arc(targetLeft, targetTop, 50 * rpx, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        if (this.finishProgress === 0) {
            drawArrow(this.pointer, ctx, targetLeft, targetTop - 20 * rpx, Math.PI * 1 / 2 - progressAngle)
            ctx.restore()
        } else if (this.finishProgress > 0 && this.finishProgress < 1) {
            const progress = Math.floor(this.finishProgress * 3)
            const str = `${3 - progress}`
            drawTimer(ctx, targetLeft, targetTop, str)
        } else {
            drawSuccess(ctx, targetLeft, targetTop)
        }
    }

    drawFinishProgress() {
        const start = 3 * Math.PI / 2
        const progress = Math.PI * 2 * this.finishProgress
        const ctx = this.ctx
        ctx.beginPath()
        ctx.lineWidth = 12 * rpx
        ctx.strokeStyle = "#52FFF5"
        ctx.lineCap = "square"
        ctx.arc(this.centerX - this.redis, this.centerY, 56 * rpx, start, start + progress)
        ctx.stroke()
        ctx.closePath()
        this.catchSamples()
        if (this.finishProgress <= 1) {
            this.finishProgress = this.finishProgress + this.finishProgressSpeed
        }
    }
}
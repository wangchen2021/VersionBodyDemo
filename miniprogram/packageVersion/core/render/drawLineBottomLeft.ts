import AngleRender from "./angleRender"
import { drawArrow, drawTimer } from "./shapeRender"
const dpr = wx.getSystemInfoSync().pixelRatio
const rpx = dpr * wx.getSystemInfoSync().windowWidth / 750
export default class DrawLineMidRight extends AngleRender implements drawAngle {
    private loopWidth = 50 * rpx
    private startX!: number
    private startY!: number
    private endX!: number
    private endY!: number
    private totalLength!: number
    setAngle(angle: number) {
        this.startX = this.width * 0.15
        this.startY = this.height * 0.66
        this.endX = this.width * 0.15
        this.endY = this.height * 0.9
        this.totalLength = this.endY - this.startY
        if (angle === 0 && this.result.length === 4) {
            this.outputResult(this.result)
            this.reset()
        }
        const diff = Math.abs(angle - this.angle)
        if (diff > 0.15 * this.angle) {
            this.startTimer = false
            this.flashLoop = 0
            this.flashLoopSpeed = 1 / 15
        }
        this.realAngle=angle
        if(this.realAngle>this.maxValue){
            this.angle = this.maxValue
        }else{
            this.angle=angle
        }
        this.progress = this.angle / this.maxValue
        this.progress = this.progress > 1 ? 1 : this.progress
        this.clear()
        this.draw()
    }

    private draw() {
        this.drawBack()
        if (!this.startTimer) {
            this.finishProgress = 0
            this.timerFont = 68
            this.drawValueShapBack()
            this.drawValueShap()
            if (this.angle === 0) {
                this.drawValueShapArrow()
            }
        } else {
            if (this.finishProgress < 1) {
                this.finishProgress = this.finishProgress + this.finishProgressSpeed
            }
            const progress = Math.floor(this.finishProgress * 3)
            const str = `${3 - progress}`
            if (this.timerStr != str) {
                this.timerFont = 68
            }
            if (str === "3") {
                this.drawValueShapBackToCenter()
            }
            if (str == "0") {
                this.outputResult(this.sampleRes)
                this.reset()
            }
            drawTimer(this.ctx, this.width / 2, this.height / 2, str, this.timerFont)
            this.timerFont = this.timerFont + 47
            this.timerStr = str
        }
        if (this.sampleInterval === 0) {
            this.sampleAngle(this.realAngle)
            this.sampleInterval = 20
        }
        this.sampleInterval--
    }

    private drawBack() {
        const ctx = this.ctx
        ctx.beginPath()
        const gradient = ctx.createLinearGradient(this.startX, this.startY, this.endX, this.endY);
        gradient.addColorStop(0, "#d4d4d42d")
        gradient.addColorStop(0.5, "#d4d4d4ce")
        gradient.addColorStop(1, "#d4d4d42d")
        ctx.lineCap = "round"
        ctx.strokeStyle = gradient
        ctx.lineWidth = this.loopWidth
        ctx.moveTo(this.startX, this.startY)
        ctx.lineTo(this.endX, this.endY)
        ctx.stroke()
        ctx.closePath()
    }
    drawValueShapBack() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.fillStyle = "#dbecff94"
        ctx.arc(this.startX, this.startY + this.totalLength * this.progress, 45 * rpx + this.flashLoop * 20 * rpx, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        if (this.flashLoop <= 0) {
            this.flashLoopSpeed = Math.abs(this.flashLoopSpeed)
        }
        if (this.flashLoop > 1) {
            this.flashLoopSpeed = -Math.abs(this.flashLoopSpeed)
        }
        this.flashLoop = this.flashLoop + this.flashLoopSpeed
    }
    drawValueShapBackToCenter() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.fillStyle = "#dbecff94"
        ctx.arc(this.startX, this.startY + this.totalLength * this.progress, 45 * rpx + this.flashLoop * 20 * rpx, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
        this.flashLoopSpeed = Math.abs(this.flashLoopSpeed)
        this.flashLoop = this.flashLoop + this.flashLoopSpeed * 60
    }
    private drawValueShap() {
        const ctx = this.ctx
        ctx.beginPath()
        ctx.fillStyle = "#4C9EFB"
        ctx.arc(this.startX, this.startY + this.totalLength * this.progress, 35 * rpx, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
    private drawValueShapArrow() {
        drawArrow(this.pointer, this.ctx, this.startX, this.startY - 17.5 * rpx, 0)
    }

    sampleAngle(angle: number) {
        if (this.angle <= 0.2 * this.maxValue) {
            this.sampleRes = []
            return
        }
        if (this.sampleRes.length > 0) {
            const pre = this.sampleRes[this.sampleRes.length - 1]
            const diff = Math.abs(angle - pre)
            const e = (angle + pre) / 2
            if (diff >= 0.2 * e) {
                this.sampleRes = [angle]
                this.startTimer = false
                this.flashLoop = 0
                return
            } else {
                if (this.sampleRes.length === 4) {
                    this.sampleRes.shift()
                }
                this.sampleRes.push(angle)
            }

            if (this.sampleRes.length === 4) {
                // this.startTimer = true
                this.outputResult(this.sampleRes)
            }
        } else {
            this.sampleRes.push(angle)
        }
    }
}
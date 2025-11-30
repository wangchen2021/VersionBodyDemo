const dpr = wx.getSystemInfoSync().pixelRatio
const rpx = dpr * wx.getSystemInfoSync().windowWidth / 750
export function drawArrow(pointer: any, ctx: CanvasRenderingContext2D, startX: number, startY: number, angle: number) {
    ctx.setLineDash([1])
    ctx.save()
    ctx.translate(startX, startY + 20 * rpx)
    ctx.rotate(angle)
    ctx.translate(-startX, -(startY + 20 * rpx))
    ctx.drawImage(pointer, startX - 17.5 * rpx, startY, 35 * rpx, 35 * rpx);
    ctx.restore()
}

export function drawSuccess(ctx: CanvasRenderingContext2D, startX: number, startY: number) {
    ctx.beginPath()
    ctx.lineWidth = 10 * rpx
    ctx.lineCap = "square"
    ctx.strokeStyle = "#FFF"
    ctx.moveTo(startX - 20 * rpx, startY - 7 * rpx)
    ctx.lineTo(startX - 5 * rpx, startY + 13 * rpx)
    ctx.lineTo(startX + 25 * rpx, startY - 15 * rpx)
    ctx.stroke()
    ctx.closePath()
}
export function drawTimer(ctx: CanvasRenderingContext2D, startX: number, startY: number, str: string, fontSize: number = 68) {
    ctx.font = `bold ${fontSize * rpx}px Acumin Pro`
    ctx.textAlign = "center"
    ctx.fillStyle = "#94B7F0"
    ctx.fillText(str, startX, startY + 0.4 * fontSize * rpx)
}
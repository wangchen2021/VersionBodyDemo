import { calculateAngleBetweenVectors, turnPiToAngle } from "./mathTools"

export function getCloundKeyPointsAngle(keyPointsData: any, plan: estimatePlanItem, direction: "left" | "right") {
    let res = 0
    if (keyPointsData.error) {
        res = -1
    } else {
        const points = keyPointsData.landmarks
        switch (plan.name) {
            case "neckBend":
                res = getNeckBendAngle(points, direction)
                break
            case "neckRotate":
                res = getNeckRotateAngle(points, direction)
                break
            case "neckRoll":
                res = getNeckRollAngle(points, direction)
                break
            case "legLift":
                res = getLegLiftAngle(points, direction)
                break
            case "headLift":
                res = getHeadLiftAngle(points, direction)
                break
            case "headBackLift":
                res = getHeadBackLiftAngle(points, direction)
                break
            case "lumbarExtension":
                res = getLumbarExtension(points, direction)
                break
            case "lumbarRoll":
                res = getLumbarRollAngle(points, direction)
                break
        }
    }

    return Math.round(res)
}

function getNeckBendAngle(points: points3d[], direction: "left" | "right") {
    const point1 = points[0]
    const point2 = { x: (points[12].x + points[11].x) / 2, y: (points[12].y + points[11].y) / 2 }
    const diffX = point1.x - point2.x
    const diffY = point1.y - point2.y
    const v1 = { x: diffX, y: diffY }
    const v2 = { x: 0, y: 1 }
    if (point1.x > point2.x && direction === "left") return 0
    if (point1.x < point2.x && direction === "right") return 0
    let angle = calculateAngleBetweenVectors(v1, v2)
    if (angle > 90) angle = 180 - angle
    if (angle < 0) angle = 0
    return angle
}

function getNeckRotateAngle(points: points3d[], _direction: "left" | "right") {
    const diffX = Math.abs(points[7].x - points[8].x)
    const diffZ = Math.abs(points[7].x - points[8].z)
    let anglePi = Math.atan(diffZ / diffX)
    return turnPiToAngle(anglePi)
}

function getNeckRollAngle(points: points3d[], direction: "left" | "right") {
    const point1 = points[7]
    const point2 = { x: (points[12].x + points[11].x) / 2, y: (points[12].y + points[11].y) / 2 }
    const point3 = { x: (points[24].x + points[23].x) / 2, y: (points[24].y, points[23].y) / 2 }
    const diffX = point1.x - point2.x
    const diffY = point1.y - point2.y
    const v1 = { x: diffX, y: diffY }
    const v2 = { x: point3.x - point2.x, y: point3.y - point2.y }
    if (point1.x > point2.x && direction === "left") return 0
    if (point1.x < point2.x && direction === "right") return 0
    let angle = calculateAngleBetweenVectors(v1, v2)
    if (angle > 100) angle = 180 - angle
    if (angle < 0) angle = 0
    return angle;
}

function getLegLiftAngle(points: points3d[], direction: "left" | "right") {
    let projectionA!: points3d
    let projectionB!: points3d
    if (direction === "left") {
        projectionA = points[23]
        projectionB = points[25]
    } else {
        projectionA = points[24]
        projectionB = points[26]
    }
    // 计算投影线段与Y轴的夹角
    let deltaY = projectionB.y - projectionA.y;
    let deltaX = projectionB.x - projectionA.x;
    if (deltaY > 0 && deltaX > 0) return 0
    let angleRadians = Math.atan(deltaX / deltaY);
    let angle = turnPiToAngle(angleRadians)
    if (angle <= 0) angle = angle
    else if (angle > 40) angle = 180 - angle
    return Math.abs(angle)
}

function getHeadLiftAngle(points: points3d[], direction: "left" | "right") {
    let projectionA!: points2d
    let projectionB!: points2d
    if (direction === "left") {
        projectionA = points[11]
        projectionB = points[15]
    } else {
        projectionA = points[12]
        projectionB = points[16]
    }
    // 计算投影线段与Y轴的夹角 
    let deltaY = projectionB.y - projectionA.y;
    let deltaX = projectionB.x - projectionA.x;
    let angleRadians = Math.atan(deltaX / deltaY);
    let angle = angleRadians * (180 / Math.PI);
    if (deltaY > 0 && deltaX > 0) return 0
    if (deltaY < 0 && deltaX > 0) { return 180 - angle }
    if (angle <= 0) angle = -angle
    else angle = 180 - angle
    return angle
}
function getHeadBackLiftAngle(points: points3d[], direction: "left" | "right") {
    let projectionA!: points3d
    let projectionB!: points3d
    if (direction === "left") {
        projectionA = points[11]
        projectionB = points[15]
    } else {
        projectionA = points[12]
        projectionB = points[16]
    }
    const v1 = { x: projectionA.x - projectionB.x, y: projectionA.y - projectionB.y }
    const v2 = { x: 0, y: 1 }
    let angle = calculateAngleBetweenVectors(v1, v2)
    return 180 - angle
}

function getLumbarExtension(points: points3d[], direction: "left" | "right") {
    const A = points[24]
    const B = points[23]
    const C = points[12]
    const D = points[11]
    const midStartPoint = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
    const midEndPoint = { x: (C.x + D.x) / 2, y: (C.y + D.y) / 2 }
    const diffX = midEndPoint.x - midStartPoint.x
    const diffY = midEndPoint.y - midStartPoint.y
    const anglePi = Math.atan(diffX / diffY)
    if (direction === "left") {
        if (midEndPoint.x > midStartPoint.x) return 0
        const angle = Math.abs(Math.round(anglePi * (180 / Math.PI)));
        return angle
    } else {
        if (anglePi > 0) return 0
        return -anglePi * (180 / Math.PI);
    }
}

function getLumbarRollAngle(points: points3d[], direction: "left" | "right") {
    const A = points[24]
    const B = points[23]
    const C = points[12]
    const D = points[11]
    const midStartPoint = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }
    const midEndPoint = { x: (C.x + D.x) / 2, y: (C.y + D.y) / 2 }
    const diffX = midEndPoint.x - midStartPoint.x
    const diffY = midEndPoint.y - midStartPoint.y
    let anglePi = Math.atan(diffX / diffY)
    if (direction === "left") anglePi = -anglePi
    if (anglePi > 0) return 0
    return -anglePi * (180 / Math.PI);
}
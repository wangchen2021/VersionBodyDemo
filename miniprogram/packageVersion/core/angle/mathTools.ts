/**
 * @description 弧度转角度
 * @param pi 弧度
 */
export function turnPiToAngle(pi: number) {
    return 180 * pi / Math.PI
}
/**
 * @description 角度转弧度
 * @param degrees 角度
 */
export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}


/**
 * @description 相机坐标系到世界坐标系
 * @param cameraPoint 转换的点
 * @param cameraParams 相机外参
 */
export function cameraToWorldCoordinates(cameraPoint: points3d, cameraParams: number[]): points3d {
    // 从外参数组中提取旋转矩阵和平移向量
    const rotationMatrix = [
        [cameraParams[0], cameraParams[1], cameraParams[2]],
        [cameraParams[4], cameraParams[5], cameraParams[6]],
        [cameraParams[8], cameraParams[9], cameraParams[10]]
    ];
    const translationVector = [cameraParams[3], cameraParams[7], cameraParams[11]];

    // 执行旋转和平移操作
    const worldX = rotationMatrix[0][0] * cameraPoint.x + rotationMatrix[0][1] * cameraPoint.y + rotationMatrix[0][2] * cameraPoint.z + translationVector[0];
    const worldY = rotationMatrix[1][0] * cameraPoint.x + rotationMatrix[1][1] * cameraPoint.y + rotationMatrix[1][2] * cameraPoint.z + translationVector[1];
    const worldZ = rotationMatrix[2][0] * cameraPoint.x + rotationMatrix[2][1] * cameraPoint.y + rotationMatrix[2][2] * cameraPoint.z + translationVector[2];

    return { x: worldX, y: worldY, z: worldZ };
}
/**
 * @description 求参考点与 zy 平面夹角
 * @param point 参考点
 * @param intrinsicArray 相机内参 
 * @param extrinsicArray 相机外参
 */
export function getPointAngleWithZY(point: points3d, intrinsicArray: number[], extrinsicArray: number[]) {
    // 将相机内外参数数组转换为相应的矩阵形式
    const intrinsicMatrix: number[][] = [
        [intrinsicArray[0], intrinsicArray[1], intrinsicArray[2], intrinsicArray[3]],
        [intrinsicArray[4], intrinsicArray[5], intrinsicArray[6], intrinsicArray[7]],
        [intrinsicArray[8], intrinsicArray[9], intrinsicArray[10], intrinsicArray[11]],
        [intrinsicArray[12], intrinsicArray[13], intrinsicArray[14], intrinsicArray[15]]
    ];
    const extrinsicMatrix: number[][] = [
        [extrinsicArray[0], extrinsicArray[1], extrinsicArray[2], extrinsicArray[3]],
        [extrinsicArray[4], extrinsicArray[5], extrinsicArray[6], extrinsicArray[7]],
        [extrinsicArray[8], extrinsicArray[9], extrinsicArray[10], extrinsicArray[11]],
        [extrinsicArray[12], extrinsicArray[13], extrinsicArray[14], extrinsicArray[15]]
    ];

    // 定义点 a 的齐次坐标
    const pointA: number[] = [point.x, point.y, point.z, 1];

    // 计算点 a 在屏幕坐标系中的坐标
    const pointAScreen: number[] = multiplyMatrixByVector(multiplyMatrices(intrinsicMatrix, extrinsicMatrix), pointA);

    // 将结果向量除以其第四个分量以获得三维坐标
    const pointAScreen3D: number[] = [
        pointAScreen[0] / pointAScreen[3],
        pointAScreen[1] / pointAScreen[3],
        pointAScreen[2] / pointAScreen[3]
    ];

    // 计算点 a 在屏幕坐标系中的向量与 zy 平面法向量的夹角
    const cosAngle: number = Math.abs(pointAScreen3D[0]) / Math.sqrt(pointAScreen3D[0] * pointAScreen3D[0] + pointAScreen3D[1] * pointAScreen3D[1] + pointAScreen3D[2] * pointAScreen3D[2]);
    const angleRadians: number = Math.acos(cosAngle);
    const angleDegrees: number = angleRadians * (180 / Math.PI);
    return angleDegrees
}

/**
 * @description 求线段与 zy 平面夹角
 * @param pointA 线段起点
 * @param pointB 线段终点
 * @param intrinsicArray 相机内参 
 * @param extrinsicArray 相机外参
 */
export function getLineSegmentAngleWithZY(pointA: points3d, pointB: points3d, intrinsicArray: number[], extrinsicArray: number[]): number {
    // 计算线段中点的坐标
    const midPoint: points3d = {
        x: (pointA.x + pointB.x) / 2,
        y: (pointA.y + pointB.y) / 2,
        z: (pointA.z + pointB.z) / 2
    };

    // 计算中点与 zy 平面的夹角
    return getPointAngleWithZY(midPoint, intrinsicArray, extrinsicArray);
}

// 矩阵与向量相乘函数
function multiplyMatrixByVector(matrix: number[][], vector: number[]): number[] {
    let result: number[] = [];
    for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < matrix[i].length; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result[i] = sum;
    }
    return result;
}

// 矩阵乘法函数
function multiplyMatrices(matrix1: number[][], matrix2: number[][]): number[][] {
    let result: number[][] = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrix1[0].length; k++) {
                sum += matrix1[i][k] * matrix2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}
/**
 * @description 求两向量夹角
 * @param vectorA 
 * @param vectorB 
 */
export function calculateAngleBetweenVectors(vectorA: points2d, vectorB: points2d): number {
    // 计算两个向量的点积
    const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y;

    // 计算两个向量的模
    const magnitudeA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2);
    const magnitudeB = Math.sqrt(vectorB.x ** 2 + vectorB.y ** 2);

    // 使用点积和模来计算夹角的余弦值
    const cosine = dotProduct / (magnitudeA * magnitudeB);

    // 确保计算的余弦值在[-1, 1]的范围内
    const clampedCosine = Math.max(-1, Math.min(1, cosine));

    // 计算夹角（以弧度为单位）
    const angleRadians = Math.acos(clampedCosine);

    // 将夹角转换为度数
    const angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
}

export function calculateDistance(point1: points2d, point2: points2d) {
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}
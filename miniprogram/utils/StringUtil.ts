

//1、知道要删除项的下标值
//index为删除项的下标值  arr为源数组
export function arrRemoveIndex (index: any, arr: any) {
    if (!arr || arr.length == 0) {
        return ""
    }
    arr.splice(index, 1)
    return arr
}

//2、知道要删除项的值
//it 为要删除项的值  arr为源数组
export function arrRemove (it: any, arr: any) {
    if (!arr || arr.length == 0) {
        return ""
    }
    let flag = arr.indexOf(it)
    if (flag > -1) {
        arr.splice(flag, 1)
        return arr
    } else {
        console.log("未查找到该元素")
    }
}

//3、如果要删除项为对象，我们需要知道该对象属性中的唯一值（不会重复的值）
//arr是源数组，attr是目标数组中的属性名称，value是要删除的属性名称对应的值
export function arrRemoveJson (arr: any, attr: any, value: any) {
    if (!arr || arr.length == 0) {
        return ""
    }
    let newArr = arr.filter(function (item: any) {
        return item[attr] != value
    })
    return newArr
}



/**
 * @returns 去除查询字符串
 */
export function removeQueryParma(s: string): string {

    s = s.toLocaleLowerCase()
    s = s.substring(0, s.lastIndexOf('?'))
    return s

}

/**
 * @returns 文件后缀且不带.
 */
export function getSuffix(s: string): string {

    s = s.toLocaleLowerCase()
    s = s.substring(s.lastIndexOf('.') + 1)
    return s

}

export function getRandomItems(arr:any[], count:number) {
    let shuffled = arr.slice();
    let result = [];
    count = Math.min(count, shuffled.length);
    for (let i = shuffled.length - 1; i > 0; i--) {
      // 生成从0到i的随机数
      let j = Math.floor(Math.random() * (i + 1));
      // 交换元素
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    result = shuffled.slice(0, count);
    return result;
  }

/**
 * @returns 通过后缀获得content-type
 */
export function getContentType(s: string) {

    switch (s) {
        case 'png':
            return 'image/png'
        case 'jpg':
            return 'image/jpeg'
        case 'jpeg':
            return 'image/jpeg'
        case 'gif':
            return 'image/gif'
        case 'avi':
            return 'video/avi'
        case 'jfif':
            return 'image/jpeg'
        case 'mp3':
            return 'audio/mp3'
        case 'mp4':
            return 'video/mpeg4'
        case 'wav':
            return 'audio/wav'
        case 'json':
            return 'application/json'
        default:
            return null
    }

}

export function generateRandomString(length:number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
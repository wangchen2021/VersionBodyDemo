import { CDN } from "../../../api/config"

const preImgUrl = CDN + "/public/bodyParts/"

/**
 * @description 人体疼痛选点图形数据（疼痛）
 */
export const painParts: chenVersion.PainPart[] = [
    {
        name: "臀部(右)",
        img: preImgUrl + "Ellipse 1905.png",
        style: {
            left: 62.5,
            top: 43.5,
            height: 11.5
        },
        showLabel: "right",
    },
    {
        name: "臀部(左)",
        img: preImgUrl + "Ellipse 1906.png",
        style: {
            left: 40,
            top: 43,
            height: 11.5
        },
        showLabel: "left",
    },
    {
        name: "中背",
        img: preImgUrl + "Rectangle 3464626.png",
        style: {
            left: 52,
            top: 29.9,
            height: 8
        },
        showLabel: "right",
    },
    {
        name: "骨盆后侧",
        img: preImgUrl + "Subtract.png",
        style: {
            left: 51,
            top: 38,
            height: 4.5
        },
        showLabel: "right-mid-long",
    },
    {
        name: "斜方肌(右)",
        img: preImgUrl + "Vector 938.png",
        style: {
            left: 61.1,
            top: 13.5,
            height: 4.5
        },
        showLabel: "right",
    },
    {
        name: "斜方肌(左)",
        img: preImgUrl + "Vector 939.png",
        style: {
            left: 41,
            top: 13.5,
            height: 4.5
        },
        showLabel: "left",
    },
    {
        name: "脖子",
        img: preImgUrl + "Vector 940.png",
        style: {
            left: 50.6,
            top: 13.5,
            height: 5
        },
        showLabel: "right-high",
    },
    {
        name: "肩胛骨缝(左)",
        img: preImgUrl + "Vector 941-1.png",
        style: {
            left: 45.5,
            top: 18,
            height: 12
        },
        showLabel: "left-mid-long",
    },
    {
        name: "肩胛骨缝(右)",
        img: preImgUrl + "Vector 942-1.png",
        style: {
            left: 58,
            top: 18,
            height: 12
        },
        showLabel: "right-mid-long",
    },
    {
        name: "肩峰(右)",
        img: preImgUrl + "Vector 941.png",
        style: {
            left: 69.7,
            top: 18.2,
            height: 6.2
        },
        showLabel: "right-short",
    },
    {
        name: "肩峰(左)",
        img: preImgUrl + "Vector 942.png",
        style: {
            left: 33.32,
            top: 18.2,
            height: 6.2
        },
        showLabel: "left",
    },
    {
        name: "后脑勺",
        img: preImgUrl + "Vector 943-1.png",
        style: {
            left: 51.4,
            top: 9,
            height: 3.7
        },
        showLabel: "right-high",
    },
    {
        name: "腰两侧(右)",
        img: preImgUrl + "Vector 943.png",
        style: {
            left: 64.5,
            top: 31,
            height: 12.2
        },
        showLabel: "right",
    },
    {
        name: "腰两侧(左)",
        img: preImgUrl + "Vector 944.png",
        style: {
            left: 37.4,
            top: 31,
            height: 12.2
        },
        showLabel: "left",
    }
]

export const bodyParts:chenVersion.BodyPart[]=[
    {
        name:"头前伸",
        img:preImgUrl+"20240602-014758.png",
    },
    {
        name:"高低肩",
        img:preImgUrl+"20240602-014804.png",
    },
    {
        name:"肩内扣/圆肩",
        img:preImgUrl+"20240602-014809.png",
    },
    {
        name:"驼背",
        img:preImgUrl+"20240602-014815.png",
    },
    {
        name:"骨盆前倾",
        img:preImgUrl+"20240602-014820.png",
    },
    {
        name:"小腹突出",
        img:preImgUrl+"20240602-014826.png",
    },
    {
        name:"臀部形态不佳",
        img:preImgUrl+"20240602-014831.png",
    },
    {
        name:"腿型不佳",
        img:preImgUrl+"20240602-014837.png",
    },
    {
        name:"扁平足/高足弓",
        img:preImgUrl+"20240602-014843.png",
    },
] 
export function getPainPartsByNames(names: string[]) {
    return painParts.filter((item: chenVersion.PainPart) => {
        return names.includes(item.name)
    })
}

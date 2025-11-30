import { CDN } from "../../../api/config"
import { snowAngel } from "../options/index"
import DrawLineBottomLeft from "../render/drawLineBottomLeft"
import DrawLineBottomLeftReverse from "../render/drawLineBottomLeftReverse"
import DrawLineBottomRight from "../render/drawLineBottomRight"
import DrawLineMidLeft from "../render/drawLineMidLeft"
import DrawLineMidRight from "../render/drawLineMidRight"
import DrawLoopBottomLeft from "../render/drawLoopBottomLeft"
import DrawLoopMidLeft from "../render/drawLoopMidLeft"
import DrawLoopMidRight from "../render/drawLoopMidRight"
import DrawLoopTopLeftReverse from "../render/drawLoopTopLeftReverse"

const videoPre = CDN + "/public/video0724"
const audiosPre = CDN + "/public/audios"
const photoPre = CDN + "/public/coverImg"
/**
 * @description 测试动作类型
 */
export const estimatePlan: estimatePlanItem[] = [
  //finish 0 1
  {
    value: 1,
    name: "neckBend",
    label: "颈部左右侧屈",
    checkDirection: "front",
    detectMaxValue: {
      left: 90,
      right: 90
    },
    detectShape: {
      left: new DrawLoopMidLeft(),
      right: new DrawLoopMidRight()
    },
    videoSrc: {
      left: videoPre + "/颈部左侧侧屈.mp4",
      right: videoPre + "/颈部右侧侧倾.mp4"
    },
    nameAudios: {
      left: audiosPre + "/l1.MP3",
      right: audiosPre + "/r1.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-141944.png",
      right: photoPre + "/20240521-141952.png"
    },
    photoName: {
      left: "颈部左屈",
      right: "颈部右屈"
    },
    reportShowData: [{
      name: "颈部侧屈",
      img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/颈部左右侧屈.png",
      h1: "颈部侧屈正常值：左屈 > 45° 右屈 > 45°",
      angle: [
        {
          preText: "左屈",
          referValue: 45,
          label: ""
        },
        {
          preText: "右屈",
          referValue: 45,
          label: ""
        },
      ],
      content: null
    }]
  },
  //finish 2 3
  {
    value: 2,
    name: "neckRotate",
    label: "颈部左右旋",
    checkDirection: "front",
    detectMaxValue: {
      left: 90,
      right: 90
    },
    detectShape: {
      left: new DrawLineMidLeft(),
      right: new DrawLineMidRight()
    },
    videoSrc: {
      left: videoPre + "/颈部左侧旋转.mp4",
      right: videoPre + "/颈部右侧旋转.mp4"
    },
    nameAudios: {
      left: audiosPre + "/l2.MP3",
      right: audiosPre + "/r2.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-142248.png",
      right: photoPre + "/20240521-142254.png"
    },
    photoName: {
      left: "颈部左旋",
      right: "颈部右旋"
    },
    reportShowData: [{
      name: "颈部旋转",
      img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/颈部左右旋转.png",
      h1: "颈部旋转正常值：左旋 > 50° 右旋 > 50°",
      angle: [{
        preText: "左旋",
        referValue: 50,
        label: ""
      },
      {
        preText: "右旋",
        referValue: 50,
        label: ""
      },
      ],
      content: null
    }]
  },
  // 4 5
  {
    value: 4,
    name: "lumbarRoll",
    label: "腰椎侧屈",
    checkDirection: "front",
    detectMaxValue: {
      left: 90,
      right: 90
    },
    detectShape: {
      left: new DrawLineBottomLeft(),
      right: new DrawLineBottomRight()
    },
    videoSrc: {
      left: videoPre + "/腰椎左侧侧屈.mp4",
      right: videoPre + "/腰椎右侧侧屈.mp4",
    },
    nameAudios: {
      left: audiosPre + "/l4.MP3",
      right: audiosPre + "/r4.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-142438.png",
      right: photoPre + "/20240521-142444.png"
    },
    photoName: {
      left: "腰部左侧屈",
      right: "腰部右侧屈"
    },
    reportShowData: [{
      name: "腰椎侧屈",
      img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/腰椎侧屈.png",
      h1: "腰椎侧屈正常值：左屈 > 35° 右屈 > 35°",
      angle: [{
        preText: "左屈",
        referValue: 35,
        label: ""
      },
      {
        preText: "右屈",
        referValue: 35,
        label: ""
      },
      ],
      content: null
    }]
  },
  //finish 6 7
  {
    value: 3,
    name: "neckRoll",
    label: "颈部前屈后伸",
    checkDirection: "side",
    detectMaxValue: {
      left: 90,
      right: 90
    },
    detectShape: {
      left: new DrawLoopMidLeft(),
      right: new DrawLoopMidRight()
    },
    videoSrc: {
      left: videoPre + "/颈椎屈曲低头.mp4",
      right: videoPre + "/颈部后伸后仰.mp4",
    },
    nameAudios: {
      left: audiosPre + "/l3.MP3",
      right: audiosPre + "/r3.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-142612.png",
      right: photoPre + "/20240521-142619.png"
    },
    photoName: {
      left: "颈部前屈",
      right: "颈部后伸"
    },
    reportShowData: [
      {
        name: "颈部前屈",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/颈部屈曲.png",
        h1: "颈部前屈正常值：前屈 > 80°",
        angle: [
          {
            preText: "前屈",
            referValue: 80,
            label: ""
          },
        ],
        content: null
      },
      {
        name: "颈部后伸",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/颈部后伸.png",
        h1: "颈部后伸正常值：后伸 > 80°",
        angle: [
          {
            preText: "后伸",
            referValue: 80,
            label: ""
          },
        ],
        content: null
      }
    ]
  },
  //8 9
  {
    value: 5,
    name: "legLift",
    label: "主动屈髋",
    checkDirection: "side",
    detectMaxValue: {
      left: 150,
      right: 150
    },
    detectShape: {
      left: new DrawLineBottomLeftReverse(),
      right: new DrawLineBottomLeftReverse()
    },
    videoSrc: {
      left: videoPre + "/左脚上抬.mp4",
      right: videoPre + "/右脚上抬.mp4",
    },
    nameAudios: {
      left: audiosPre + "/l5.MP3",
      right: audiosPre + "/r5.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-142911.png",
      right: photoPre + "/20240521-143726.png"
    },
    photoName: {
      left: "左屈髋",
      right: "右屈髋"
    },
    reportShowData: [
      {
        name: "主动屈髋",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/主动抬髋.png",
        h1: "主动屈髋正常值：左侧 > 120° 右侧 > 120°",
        angle: [
          {
            preText: "左侧",
            referValue: 120,
            label: ""
          },
          {
            preText: "右侧",
            referValue: 120,
            label: ""
          },
        ],
        content: null
      }
    ]
  },
  //finish 10 11
  {
    value: 6,
    name: "headLift",
    label: "主动单臂屈曲",
    checkDirection: "side",
    detectMaxValue: {
      left: 180,
      right: 180
    },
    detectShape: {
      left: new DrawLoopTopLeftReverse(),
      right: new DrawLoopTopLeftReverse()
    },

    videoSrc: {
      left: videoPre + "/左手屈曲.mp4",
      right: videoPre + "/右手屈曲.mp4"
    },
    nameAudios: {
      left: audiosPre + "/l6.MP3",
      right: audiosPre + "/r6.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-143025.png",
      right: photoPre + "/20240521-143031.png"
    },
    photoName: {
      left: "左手屈曲",
      right: "右手屈曲"
    },
    reportShowData: [
      {
        name: "单臂屈曲",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/单臂屈曲.png",
        h1: "单臂屈曲正常值：左侧 > 180° 右侧 > 180°",
        angle: [
          {
            preText: "左侧",
            referValue: 180,
            label: ""
          },
          {
            preText: "右侧",
            referValue: 180,
            label: ""
          },
        ],
        content: null
      }
    ]
  },
  //finish 12 13
  {
    value: 7,
    name: "headBackLift",
    label: "主动单臂后伸",
    checkDirection: "side",
    detectMaxValue: {
      left: 90,
      right: 90
    },
    detectShape: {
      left: new DrawLoopBottomLeft(),
      right: new DrawLoopBottomLeft()
    },
    videoSrc: {
      left: videoPre + "/左手后伸.mp4",
      right: videoPre + "/右手后伸.mp4",
    },
    nameAudios: {
      left: audiosPre + "/l7.MP3",
      right: audiosPre + "/r7.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-143204.png",
      right: photoPre + "/20240521-143209.png"
    },
    photoName: {
      left: "左手后伸",
      right: "右手后伸"
    },
    reportShowData: [
      {
        name: "单臂后伸",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/单臂后伸.png",
        h1: "单臂后伸正常值：左侧 > 50° 右侧 > 50°",
        angle: [
          {
            preText: "左侧",
            referValue: 50,
            label: ""
          },
          {
            preText: "右侧",
            referValue: 50,
            label: ""
          },
        ],
        content: null
      }
    ]
  },
  //finish 14 15
  {
    value: 8,
    name: "lumbarExtension",
    label: "腰椎前屈后伸",
    checkDirection: "side",
    detectMaxValue: {
      left: 90,
      right: 90,
    },
    detectShape: {
      left: new DrawLoopMidLeft(),
      right: new DrawLoopMidRight()
    },
    videoSrc: {
      left: videoPre + "/弯腰摸脚尖.mp4",
      right: videoPre + "/后仰后仰.mp4",
    },
    nameAudios: {
      left: audiosPre + "/l8.MP3",
      right: audiosPre + "/r8.MP3"
    },
    coverImg: {
      left: photoPre + "/20240521-143238.png",
      right: photoPre + "/20240521-143243.png"
    },
    photoName: {
      left: "腰椎前屈",
      right: "腰椎后伸"
    },
    reportShowData: [
      {
        name: "腰椎前屈",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/腰椎前屈.png",
        h1: "腰椎前屈正常值：前屈 > 90°",
        angle: [
          {
            preText: "前屈",
            referValue: 90,
            label: ""
          },
        ],
        content: null
      },
      {
        name: "腰椎后伸",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/腰椎后仰.png",
        h1: "腰椎后伸正常值：后伸 > 30°",
        angle: [
          {
            preText: "前屈",
            referValue: 30,
            label: ""
          },
        ],
        content: null
      }
    ]
  },
  //9 靠墙雪天使
  {
    value: 9,
    name: "snowAngel",
    label: "靠墙雪天使",
    checkDirection: "front",

    options: snowAngel,

    detectMaxValue: {
      left: 180,
      right: 180
    },

    detectShape: {
      left: new DrawLoopTopLeftReverse(),
      right: new DrawLoopTopLeftReverse()
    },

    videoSrc: {
      left: "http://1312576865.vod-qcloud.com/1600c0eevodcq1312576865/5a06fc311397757900586042892/f0.mp4",
      right: ""
    },

    nameAudios: {
      left: "https://vcos.changan-health.com/thi/webapp/20251130/1.mp3",
      right: audiosPre + "/r6.MP3"
    },

    coverImg: {
      left: photoPre + "/20240521-143025.png",
      right: photoPre + "/20240521-143031.png"
    },

    photoName: {
      left: "左手屈曲",
      right: "右手屈曲"
    },

    reportShowData: [
      {
        name: "单臂屈曲",
        img: "https://cos.painspective.com/jizhi/miniProgram/public/flexImgs/单臂屈曲.png",
        h1: "单臂屈曲正常值：左侧 > 180° 右侧 > 180°",
        angle: [
          {
            preText: "左侧",
            referValue: 180,
            label: ""
          },
          {
            preText: "右侧",
            referValue: 180,
            label: ""
          },
        ],
        content: null
      }
    ]
  },
]

export function getPlansByValues(values: string[]) {
  return estimatePlan.filter((item: estimatePlanItem) => {
    return values.includes(`${item.value}`)
  })
}

export function getFlexSubmitParam(results: number[], selectPlans: estimatePlanItem[]) {
  const param: Array<any> = []
  for (let plan of selectPlans) {
    const leftRes = results.shift()
    const rightRes = results.shift()
    param.push({
      id: plan.value,
      detectValue: [leftRes, rightRes]
    })
  }
  console.log("Submit Flex_data:", param);
  return param
}

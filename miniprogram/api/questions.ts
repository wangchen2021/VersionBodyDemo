export function getQuestions() {
    return [
        {
            name: "painTypes",
            title: "您的肌骨不适感属于哪几种类型？",
            options: [
                { text: "疼痛", width: 152 },
                { text: "酸胀", width: 152 },
                { text: "卡顿", width: 152 },
                { text: "弹响", width: 152 },
                { text: "麻木/蹿麻/过电", width: 314 },
                { text: "僵硬紧绷", width: 152 },
                { text: "无力", width: 152 },
                { text: "其他", width: 314 },
                { text: "无不适感", width: 314 },
            ]
        },
        {
            name: "painFeel",
            title: "您的疼痛或不适更偏向哪一种感觉？",
            options: [
                { text: "刺痛", width: 206 },
                { text: "胀痛/酸胀", width: 206 },
                { text: "撕裂痛", width: 206 },
                { text: "放射性疼痛", width: 314 },
                { text: "深层隐隐作痛", width: 314 },
                { text: "电击痛/麻痹感", width: 314 },
                { text: "跳痛/搏动性疼痛", width: 314 },
                { text: "以上皆不是", width: 638 },
            ]
        },
        {
            name: "painTime",
            title: "你疼痛/不适的问题已经持续多久了？",
            options: [
                { text: "1 个月以下", width: 206 },
                { text: "1～3 个月", width: 206 },
                { text: "3～6 个月", width: 206 },
                { text: "6～12 个月", width: 314 },
                { text: "一年以上", width: 314 },
            ]
        },
        {
            name: "painScore",
            title: "疼痛不适对您生活、工作、娱乐等方面造成多大程度困扰呢？",
        },
        {
            name: "age",
            title: "你的年龄？",
        },
        {
            name: "workType",
            title: "您的工作类型属于以下哪种？",
            options: [
                { text: "久坐型", width: 206 },
                { text: "久站型", width: 206 },
                { text: "脑力型", width: 206 },
                { text: "体力型", width: 314 },
                { text: "动静结合型", width: 314 },
            ]
        },
    ]
}
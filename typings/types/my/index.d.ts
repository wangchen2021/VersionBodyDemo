type httpResponse = {
  code: number,
  data: any,
  msg: string,
  success: boolean,
}

type UserLabels = {
  type: number,
  gender: string,
  age: number,
  height: number,
  weight: number,
  job: string,
  sport: string,
}

declare namespace chenVersion {
  type PainPart = {
      name: string,
      img: string,
      style: {
          left: number,
          top: number,
          height: number
      },
      showLabel: string,
  }

  type BodyPart = {
      name: string,
      img: string,
  }
}

declare namespace Language {

  type LanguageItem = {
      CN: string,
      EN: string,
  }
  interface LanguageList {
      [key: string]: LanguageItem
  }
}
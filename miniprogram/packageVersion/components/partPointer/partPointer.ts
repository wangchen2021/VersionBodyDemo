import { lanuage_bind } from "../../../language/index"

Component({

    properties: {
        showType: {
            type: String
        },
        label: {
            type: String
        }
    },

    lifetimes:{
     attached(){
         lanuage_bind(this,"pain")
     }
    },

    methods: {

    }
})
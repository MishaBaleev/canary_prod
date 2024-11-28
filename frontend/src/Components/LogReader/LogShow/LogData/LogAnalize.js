import GraphAnalize from "./GraphAnalize";
import axios from "axios";

const LogAnalize = (props) => {
    //handlers
    const secToTime = (value) => {
        if (value === 0){
            return "00:00:00"
        }else{
            let seconds = Number(value)
            let h = Math.floor(seconds % (3600*24) / 3600)+3
            let m = Math.floor(seconds % 3600 / 60)
            let s = Math.floor(seconds % 60)
            return (h<10?("0"+h):h)+":"+(m<10?("0"+m):m)+":"+(s<10?("0"+s):s)
        }
    }

    const getTime = (type) => {
        let time_arr = []
        props.cur_frame_arr[type].forEach(item => {
            time_arr.push(secToTime(item.time))
        })
        return time_arr
    }

    const getPayload = (type) => {
        let payload_arr = []
        props.cur_frame_arr[type].forEach(item => {
            let frame = JSON.parse(item.frame).arr
            let counter = 0
            frame.forEach(f => {
                if (f > 0){counter++}
            })
            payload_arr.push(counter)
        })
        return payload_arr
    }
    
    const getAvValue = (type) => {
        let av_value_arr = []
        props.cur_frame_arr[type].forEach(item => {
            let frame = JSON.parse(item.frame).arr 
            let summ = 0 
            let counter = 0
            frame.forEach(f => {
                if (f > 0){
                    summ += f
                    counter ++
                }
            })
            if (counter === 0){av_value_arr.push(0)}else{av_value_arr.push(summ/counter)}
        })
        return av_value_arr
    }

    const getZoneState = (type) => {
        let zone_state_arr = []
        props.cur_frame_arr[type].forEach(item => {
            let zone_state = parseInt(item.zone_state)
            if (zone_state === 0){zone_state_arr.push(0)}
            else{zone_state_arr.push(1)}
        })
        return zone_state_arr
    }

    const saveAnalize = () => {
        let time = {
            "type_915": getTime("type_915"),
            "type_2400": getTime("type_2400"),
            "type_5800": getTime("type_5800")
        }
        let payload = {
            "type_915": getPayload("type_915"),
            "type_2400": getPayload("type_2400"),
            "type_5800": getPayload("type_5800")
        }
        let av_value = {
            "type_915": getAvValue("type_915"),
            "type_2400": getAvValue("type_2400"),
            "type_5800": getAvValue("type_5800")
        }
        let zone_state = {
            "type_915": getZoneState("type_915"),
            "type_2400": getZoneState("type_2400"),
            "type_5800": getZoneState("type_5800")
        }
        let result = {
            time: time,
            payload: payload,
            av_value: av_value,
            zone_state: zone_state
        }
        let data = new FormData()
        data.append("data", JSON.stringify(result))
        data.append("log_name", props.log_name)
        axios.post("http://localhost:8001/saveAnalize", data).then(response => {
            console.log(response)
        })
    }

    return <div className="log_analize block">
        <div className="data_block">
            <div className="title_block"><p>Изменение загруженности</p></div>
            <GraphAnalize 
                time={getTime("type_915")}
                data={getPayload("type_915")}
                is_av={true}
                title="915 МГц"
            />
            <GraphAnalize 
                time={getTime("type_2400")}
                data={getPayload("type_2400")}
                is_av={true}
                title="2400 ГГц"
            />
            <GraphAnalize 
                time={getTime("type_5800")}
                data={getPayload("type_5800")}
                is_av={true}
                title="5.8 МГц"
            />
        </div>
        <div className="data_block">
            <div className="title_block"><p>Изменение среднего значения</p></div>
            <GraphAnalize 
                time={getTime("type_915")}
                data={getAvValue("type_915")}
                is_av={true}
                title="915 МГц"
            />
            <GraphAnalize 
                time={getTime("type_2400")}
                data={getAvValue("type_2400")}
                is_av={true}
                title="2400 ГГц"
            />
            <GraphAnalize 
                time={getTime("type_5800")}
                data={getAvValue("type_5800")}
                is_av={true}
                title="5.8 МГц"
            />
        </div>
        <div className="data_block">
            <div className="title_block"><p>Результаты анализа</p></div>
            <GraphAnalize 
                time={getTime("type_915")}
                data={getZoneState("type_915")}
                is_av={false}
                title="915 МГц"
            />
            <GraphAnalize 
                time={getTime("type_2400")}
                data={getZoneState("type_2400")}
                is_av={false}
                title="2400 ГГц"
            />
            <GraphAnalize 
                time={getTime("type_5800")}
                data={getZoneState("type_5800")}
                is_av={false}
                title="5.8 МГц"
            />
        </div>
        <button onClick={saveAnalize} className="save_analize"><p>Сохранить</p></button>
    </div>
}

export default LogAnalize
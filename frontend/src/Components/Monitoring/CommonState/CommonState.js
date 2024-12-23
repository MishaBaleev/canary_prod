import { useEffect, useState } from "react";
import "./CommonState.scss";

const CommonState = (props) => {
    const secToDate = (value) => {
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

    const [decision, setDecision] = useState("")
    useEffect(() => {
        const zone_2400 = props.frame.zone_state.zone_2400
        const zone_915 = props.frame.zone_state.zone_915
        const zone_5800 = props.frame.zone_state.zone_5800
        let new_decision = "Аномалй не обнаружено"
        if (zone_915 === 1 && (zone_2400 === 1 || zone_2400 === 2)){
            new_decision = "FPV БПЛА"
            setDecision(new_decision)
            return
        }
        if (zone_915 === 1 && zone_5800 === 1){
            new_decision = "FPV БПЛА"
            setDecision(new_decision)
            return
        }
        if ((zone_2400 === 1 || zone_2400 === 2) && zone_5800 === 1){
            new_decision = "FPV БПЛА"
            setDecision(new_decision)
            return
        }
        if ((zone_2400 === 1 || zone_2400 === 2)){
            new_decision = "Коммерческий БПЛА"
            setDecision(new_decision)
            return
        }
        if (zone_5800 === 1){
            new_decision = "Коммерческий БПЛА"
            setDecision(new_decision)
            return
        }
        if (zone_915 === 1){
            new_decision = "Самособранный БПЛА"
            setDecision(new_decision)
            return
        }
        setDecision(new_decision)
    }, [props.frame])

    return <div className="common_state plate">
        <div className="title">
            <p>Общее состояние</p>
        </div>
        <div className="title_bottom">
            <p>Обновлено ({secToDate(props.frame.time)})</p>
        </div>
        <div className="state_descr">
            <p>{decision}</p>
        </div>
    </div>
}
export default CommonState
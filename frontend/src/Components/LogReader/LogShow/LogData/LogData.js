import "./LogData.scss";
import CommonData from "./CommonData";
import StateData from "./StateData";
import { useState } from "react";
import common from "./img/common.png";
import state from "./img/state.png";

const LogData = (props) => {
    const [cur_cmp, setCMP] = useState(0)
    const cutText = (string) => {
        if (string.length > 20){
            return string.substring(0, 20) + "..."
        }else{ return string }
    }

    const cmps = [
        {img: common, cmp: <CommonData cur_arrs={props.cur_arrs} cur_zones={props.cur_zones} cur_notes={props.cur_notes}/>, name: "Общие"},
        {img: state, cmp: <StateData/>, name: "Реагирование"}
    ]

    return <div className="log_data">
        <div className="title">
            <p>{cutText(`Лог: ${props.log_name}`)}</p>
        </div>
        <nav className="navigation">
            {cmps.map((item, index) => {
                return <button key={index} className={cur_cmp===index?"active":""} onClick={() => {setCMP(index)}}>
                    <img src={item.img} alt="nav"/>
                    <div className="name"><p>{item.name}</p></div>
                </button>
            })}
        </nav>
        {cmps[cur_cmp].cmp}
    </div>
}
export default LogData
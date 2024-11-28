import "./Supressor.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import update from "../Controls/img/update.png";
import { connect } from "react-redux";
import { updateModal } from "../../../AppSlice";

const Suppressor = (props) => {
    const [ints, setInts] = useState([])
    const getInts = () => {
        let ints = ["Неопределен"]
        axios.get("http://127.0.0.1:8001/getInts").then(response => {
            response.data.ints.forEach(item => {
                ints.push(item)
            })
            setInts(ints)
        })
    }
    const [current_int, setCurInt] = useState(0)

    useEffect(() => {
        getInts()
    }, [])

    const [int_active, setIntActive] = useState("unactive")
    const chnageIntActive = () => {
        if (int_active === "active"){
            setIntActive("unactive")
        }else{
            if (current_int === 0){
                props.updateModal({title: "Ошибка", message: "Необходимо выбрать интерфейс"})
            }else{
                let start_config = {
                    int: ints[current_int],
                    time: suppressor_settings.Time,
                    range: suppressor_settings.Range
                }
                props.sendCommand({command: "start", start_config: start_config}, "suppressor")
                setIntActive("active")
            }
        }
    }

    const [suppressor_settings, setSupSettings] = useState({
        Time: 1000,
        Range: "24"
    })
    const changeSupSettings = (key, value) => {
        let cur_settings = {...suppressor_settings}
        cur_settings[key] = value 
        setSupSettings(cur_settings)
    }

    const presets = [
        {description: "Глушение GPS", params: {time: 1000, range: "24"}},
        {description: "Глушение на частоте 2,4 ГГц на обнаруженных каналах", params: {time: 2000, range: "24"}},
        {description: "Глушение на диапазоне частот 5,8 ГГц на обнаруженных каналах", params: {time: 3000, range: "58"}},
        {description: "Глушение диапазоне частот 915 МГц на обнаруженных каналах", params: {time: 4000, range: "915"}},
    ]
    const [cur_preset_id, setCurPreset] = useState(0)
    const changePreset = (e) => {
        let cur_preset = presets[parseInt(e.target.value)]
        let cur_settings = {...suppressor_settings}
        cur_settings.Range = cur_preset.params.range
        cur_settings.Time = cur_preset.params.time
        setSupSettings(cur_settings)
        setCurPreset(parseInt(e.target.value))
    }

    const hintIn = () => {
        let hint = document.querySelector(".suppressor_hint")
        hint.classList.remove("unactive")
        hint.classList.add("active")
    }
    const hintOut = () => {
        let hint = document.querySelector(".suppressor_hint")
        hint.classList.remove("active")
        hint.classList.add("unactive")
    }

    const suppress = () => {
        if (int_active === "active"){
            let data = {
                time: suppressor_settings.Time,
                range: suppressor_settings.Range
            }
            props.sendCommand({command: "suppress", data: data}, "suppressor")
        }else{
            props.updateModal({title: "Ошибка", message: "Необходимо подключить устройство"})
        }
    }

    return <div className="suppressor plate">
        <div className="title">
            <p>Состояние реагирования</p>
        </div>
        <div className="interface">
            <button className={"rect_button "+int_active} onClick={chnageIntActive}/>
            <select onChange={(e) => {setCurInt(parseInt(e.target.value))}}>
                {ints.map((item, index) => {
                    return <option value={index} key={index}>{item}</option>
                })}
            </select>
            <button className="update" onClick={getInts}><img src={update} alt="update"/></button>
        </div>
        <div className="set_command">
            <div className="item">
                <p className="item_title">Продолжительность (мс)</p>
                <div className="input">
                    <input type="number"
                        min={1}
                        max={10000}
                        step={1}
                        value={suppressor_settings.Time}
                        onChange={(e) => {changeSupSettings("Time", e.target.value)}}
                    />
                    <input type="range"
                        min={1}
                        max={10000}
                        step={1}
                        value={suppressor_settings.Time}
                        onChange={(e) => {changeSupSettings("Time", e.target.value)}}
                    />
                </div>
            </div>
            <div className="item space-between">
                <p className="item_title small">Диапазон</p>
                <select onChange={(e) => {changeSupSettings("Range", e.target.value)}} value={suppressor_settings.Range}>
                    <option value="24">2.4 ГГц</option>
                    <option value="915">915 МГц</option>
                    <option value="58">5.8 ГГц</option>
                    <option value="15">1.5 ГГц</option>
                </select>
            </div>
            <div className="item space-between">
                <p className="item_title small">Сценарий</p>
                <button className="show_hint" onMouseOver={hintIn} onMouseOut={hintOut}>?</button>
                <select onChange={changePreset}>
                    {presets.map((_, index) => {
                        return <option value={index} key={index}>Сценарий {index+1}</option>
                    })}
                </select>
                <div className="suppressor_hint">
                    <p className="hint_title">Сценарий {cur_preset_id+1}</p>
                    <div className="hint_descr">
                        <p>{presets[cur_preset_id].description}</p>
                    </div>
                </div>
            </div>
            <div className="item space-between">
                <p className="item_title small">Автореагирование</p>
                <input type="checkbox"

                />
            </div>
            <button className="set" onClick={suppress}>Отправить</button>
        </div>
    </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(Suppressor)
import "./Controls.scss";
import update from "./img/update.png";
import add from "./img/add.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { updateModal } from "../../../AppSlice";

const Controls = (props) => {
    const [file_name, setFileName] = useState(new Date().toLocaleString())
    const comments = ["Аномалия", "Далеко", "Близко", "Реагирование"]
    const [comment_value, setComment] = useState("")
    const [ints, setInts] = useState([])
    const [cur_int, setCurInt] = useState("")
    const getInts = () => {
        let ints = ["Не определен"]
        axios.get("http://127.0.0.1:8000/getInts").then(response => {
            response.data.ints.forEach(item => {
                ints.push(item)
            })
            setInts(ints)
        })
    }

    const [int_active, setIntActive] = useState("unactive")
    const changeIntActive = () => {
        if (int_active === "active"){
            if (rec_active === "active"){
                props.updateModal({title: "Ошибка", message: "Необходимо отключить запись"})
            }else{
                props.sendCommand({command: "off"}, "sensor")
                setIntActive("unactive")
            }
        }else{
            if (cur_int==="" || cur_int==="Не определен"){
                props.updateModal({title: "Ошибка", message: "Необходимо выбрать интерфейс"})
            }else{
                let data = {
                    command: "start",
                    start_config: {
                        int: cur_int
                    }
                }
                props.sendCommand(data, "sensor")
                setIntActive("active")
            }
        }
    }

    const [timer_value, setTimer] = useState("000")
    const [timer_obj, setTimerObj] = useState(null)
    const incrementTimer = () => {
        setTimer(timer_value => {
            let cur_timer = parseInt(timer_value)
            cur_timer += 1
            if (cur_timer < 10){
                cur_timer = `00${cur_timer}`
            }else if (cur_timer < 100){
                cur_timer = `0${cur_timer}`
            }else{
                cur_timer = `${cur_timer}`
            }
            return cur_timer
        })
        setTimerObj(setTimeout(incrementTimer, 1000))
    }

    const [rec_active, setRecActive] = useState("unactive")
    const changeRecActive = () => {
        if (rec_active === "active"){
            props.sendCommand({command: "act_rec", value: false, file_name: file_name}, "sensor")
            clearInterval(timer_obj)
            setRecActive("unactive")
        }else{
            if (int_active === "active"){
                props.sendCommand({command: "act_rec", value: true}, "sensor")
                setTimer("000")
                incrementTimer()
                setRecActive("active")
            }else{
                props.updateModal({title: "Ошибка", message: "Необходимо подключить устройство"})
            }
        }
    }

    const addComment = () => {
        if (int_active === "active"){
            if (rec_active === "active"){
                props.sendCommand({command: "add_note", value: comment_value}, "sensor")
                setComment("")
            }else{
                props.updateModal({title: "Ошибка", message: "Необходимо активировать запись"})
            }
        }else{
            props.updateModal({title: "Ошибка", message: "Необходимо подключить устройство"})
        }
    }

    useEffect(() => {
        getInts()
    }, [])

    return <div className="controls plate">
        <div className="title">
            <p>Состояние считывания</p>
        </div>
        <div className="interface">
            <button className={"rect_button "+int_active} onClick={changeIntActive}/>
            <select onChange={(e) => {setCurInt(ints[e.target.value])}}>
                {ints.map((item, index) => {
                    return <option value={index} key={index}>{item}</option>
                })}
            </select>
            <button className="update" onClick={getInts}><img src={update} alt="update"/></button>
        </div>
        <div className="main_section">
            <div className="record">
                <button className={"circle_button "+rec_active} onClick={changeRecActive}/>
                <p>Запись {timer_value}</p>
                <input type="text"
                    placeholder="Имя записи"
                    onChange={(e) => {setFileName(e.target.value)}}
                />
            </div>
            <div className="comments_title">
                <input type="text"
                    placeholder="Комментарий"
                    value={comment_value}
                    onChange={(e) => {setComment(e.target.value)}}
                />
                <button className="add" onClick={addComment}
                    ><img src={add} alt="add"/>
                </button>
            </div>
            <ul className="comments_list">
                {comments.map((item, index) => {
                    return <li key={index} onClick={() => {setComment(item)}}>
                        <p>{item}</p>
                    </li>
                })}
            </ul>
        </div>
    </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(Controls)
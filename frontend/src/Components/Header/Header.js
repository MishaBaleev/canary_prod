import "./Header.scss";
import logo from "./img/logo.png";
import monitoring from "./img/monitoring.png";
import log_reader from "./img/log_reader.png";
import { useState, useEffect } from "react";

const Header = (props) => {
    //state
    const buttons = [
        {name: "Мониторинг", img: monitoring},
        {name: "Просмотр логов", img: log_reader}
    ]
    const [time, setTime] = useState("00:00:00")

    //handlers
    const onMouseOver = (index) => {
        document.querySelector(`.hint._${index}`).classList.remove("unactive")
        document.querySelector(`.hint._${index}`).classList.add("active")
    }
    const onMouseOut = (index) => {
        document.querySelector(`.hint._${index}`).classList.remove("active")
        document.querySelector(`.hint._${index}`).classList.add("unactive")
    }

    const timerIncrement = () => {
        setTime(new Date().toLocaleTimeString())
        setTimeout(timerIncrement, 1000)
    }

    useEffect(() => {
        timerIncrement()
    }, [])

    return <header className="header">
        <div className="logo">
            <img src={logo} alt="logo"/>
            <p>Канарейка</p>
        </div>
        <nav className="navigation">
            {buttons.map((item, index) => {
                return <div className={"nav_item " + ((props.cur_cmp === index)?"active":"")} key={index} onMouseOver={() => onMouseOver(index)} onMouseOut={() => {onMouseOut(index)}}>
                    <button onClick={() => {props.changeCMP(index)}}>
                        <img src={item.img} alt="nav_item"/>
                    </button>
                    <div className={"hint _" + index}><p>{item.name}</p></div>
                </div>
            })}
        </nav>
        <div className="world_time">
            <p>{time}</p>
        </div>
    </header>
}
export default Header
import "./LogNav.scss";
import { useEffect, useState } from "react";

const LogNav = (props) => {
    const [is_play, setPlay] = useState("unactive")
    const [speed, setSpeed] = useState(1)

    useEffect(() => {
        if (is_play === "active"){
            setTimeout(() => {setNextFrame()}, 1000/speed)
        }
    }, [props.cur_frame])

    const changePlay = () => {
        if (is_play === "active"){
            setPlay("unactive")
        }else{
            setTimeout(() => {setNextFrame()}, 1000/speed)
            setPlay("active")
        }
    }

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
    const getTimeDiff = () => {
        return Math.floor(props.cur_frame.time - props.start_time)
    }

    const changeSpeed = (e) => {
        setSpeed(Number(e.target.value))
    }

    useEffect(() => {
        // console.log(props)
    })

    const setNextFrame = () => {
        let cur_id = props.cur_frame.id-1
        if (cur_id + 1 < props.length){props.setCurFrame(cur_id+1)}
    }
    const setPrevFrame = () => {
        let cur_id = props.cur_frame.id-1
        if (cur_id - 1 >= 0){props.setCurFrame(cur_id - 1)}
    }

    return <div className="log_nav">
        <div className="top">
            <div className="item big"><button onClick={props.refresh}>Выбрать новый файл</button></div>
            <div className="item"><p>Текущее время: {secToDate(props.cur_frame.time)}</p></div>
            <div className="item"><p>Время с начала: {getTimeDiff()} с</p></div>
            <div className="item"><p>Пакет {props.cur_frame.id}/{props.length}</p></div>
        </div>
        <div className="navigation">
            <input className="main_range" type="range"
                min={0}
                max={props.length-1}
                value={props.cur_frame.id-1}
                onChange={(e) => {props.setCurFrame(parseInt(e.target.value))}}
            />
            <div className="next_prev">
                <button className="prev" onClick={() => {setPrevFrame()}}/>
                <button className={"play "+is_play} onClick={changePlay}/>
                <button className="next" onClick={() => {setNextFrame()}}/>
            </div>
            <div className="speed">
                <div className="title_speed"><p>Скорость воспроизведения</p></div>
                <div className="range_speed">
                    <input type="range"
                        value={speed}
                        min={0.1}
                        max={10}
                        step={0.1}
                        onChange={changeSpeed}
                    />
                    <input type="number"
                        value={speed}
                        min={0.1}
                        max={10}
                        step={0.1}
                        onChange={changeSpeed}
                    />
                </div>
            </div>
        </div>
    </div>
}
export default LogNav
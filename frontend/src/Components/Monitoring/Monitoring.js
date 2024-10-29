import "./Monitoring.scss";
import { connect } from "react-redux";
import CommonData from "./CommonData/CommonData";
import CommonState from "./CommonState/CommonState";
import Controls from "./Controls/Controls";
import MapInput from "./MapInput/MapInput";
import Suppressor from "./Suppressor/Suppressor";
import { MapManager }  from "./MapManager"
import { useEffect, useState } from "react";
import search from "./img/search.png";
import axios from "axios";
import { updateModal } from "../../AppSlice";

const Monitoring = (props) => {

    const [frame, setFrame] = useState({
        frame: {arr_2400: Array(82).fill(0), arr_915: Array(51).fill(0), arr_5800: Array(39).fill(0)},
        time: 0,
        zone_state: {zone_2400: 0, zone_915: 0, zone_5800: 0}
    })

    const sensor_socketOnMessage = (e) => {
        let data = JSON.parse(e.data)
        console.log(data)
        let frame_new = {...frame}
        if (data.frame.type === "type_915"){
            frame_new.frame.arr_915 = data.frame.arr
            frame_new.zone_state.zone_915 = data.zone_state
        }else if (data.frame.type === "type_2400"){
            frame_new.frame.arr_2400 = data.frame.arr
            frame_new.zone_state.zone_2400 = data.zone_state
        }else if (data.frame.type === "type_5800"){
            frame_new.frame.arr_5800 = data.frame.arr
            frame_new.zone_state.zone_5800 = data.zone_state
        }
        frame_new.time = data.time
        if (frame_new.zone_state.zone_2400 === 0 && frame_new.zone_state.zone_915 === 0 && frame_new.zone_state.zone_5800 === 0){
            map_manager.safe()
        }else{
            map_manager.warning()
        }
        setFrame(frame_new)
    }

    const [sensor_socket, setSensorSocket] = useState(null)
    const [suppressor_socket, setSuppressorSocket] = useState(null)
    
    const [map_manager, setMapManager] = useState(new MapManager())
    const [position, setPosition] = useState({
        lon: null,
        lat: null,
        azimuth: null
    })
    const [place_value, setPlaceValue] = useState("")

    const changePosition = (key, value) => {
        let cur_position = {...position}
        cur_position[key] = value
        setPosition(cur_position)
        if (key === "azimuth"){
            map_manager.rotateDevice(Number(value))
        }
    }

    const getCoordsFromPlace = () => {
        let data = new FormData()
        data.append("place", place_value)
        axios.post("http://localhost:8000/getCoordsFromPlace", data).then(result => {
            if (result.data.result === true){
                map_manager.map.flyTo({center: result.data.data})
            }else{
                props.updateModal({title: "Ошибка", message: "Введен некорректный адрес или возникли проблемы с подключением к сети"})
            }
        })
    }

    const sendCommand = (data, type) => {
        if (type === "sensor"){
            sensor_socket.send(JSON.stringify(data))
        }else if (type === "suppressor"){
            suppressor_socket.send(JSON.stringify(data))
        }
    }

    useEffect(() => {
        map_manager.init()
        let sensor_socket_ = new WebSocket("ws://localhost:8000/main")
        sensor_socket_.onmessage = sensor_socketOnMessage
        setSensorSocket(sensor_socket_)

        let suppressor_consumer_ = new WebSocket("ws://localhost:8000/suppressor")
        suppressor_consumer_.onmessage = (e) => {console.log(e)}
        setSuppressorSocket(suppressor_consumer_)
    }, [])

    return <div className="monitoring">
        <CommonData frame={frame}/>
        <CommonState frame={frame}/>
        <Suppressor sendCommand={sendCommand}/>
        <Controls sendCommand={sendCommand}/>
        <MapInput changePosition={changePosition} position={position} map_manager={map_manager}/>
        <div className="map plate_big">
            <div id="map"/>
            <div className="place_search">
                <input type="text" 
                    placeholder="Место"
                    value={place_value}
                    onChange={(e) => {setPlaceValue(e.target.value)}}
                />
                <button className="search" onClick={getCoordsFromPlace}><img src={search} alt="search"/></button>
            </div>
        </div>
    </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => dispatch(updateModal(data))
}}
export default connect(mapStateToProps, mapDispatchToProps)(Monitoring)
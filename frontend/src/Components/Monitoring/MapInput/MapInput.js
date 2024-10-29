import { updateModal } from "../../../AppSlice";
import "./MapInput.scss";
import { connect } from "react-redux";

const MapInput = (props) => {

    const setDevice = () => {
        if (props.position.lon >= -90 && props.position.lon <= 90 && props.position.lon !== null
            && props.position.lat >= -90 && props.position.lat <= 90 && props.position.lat !== null
            && props.position.azimuth >= 0 && props.position.azimuth <= 360 && props.position.azimuth !== null
        ){
            props.map_manager.setDevice(props.position)
        }else{
            props.updateModal({title: "Ошибка", message: "Неверные параметры установки устройства"})
        }
    }

    const clear = () => {
        let params_arr = ["lon", "lat", "azimuth"]
        params_arr.forEach(item => {props.changePosition(item, null)})
        props.map_manager.clear()
    }

    return <div className="map_input plate">
        <div className="title">
            <p>Расположение устройства</p>
        </div>
        <div className="input_coord">
            <p>Широта</p>
            <input type="number"
                placeholder="Координата"
                min={0}
                max={90}
                step={0.1}
                value={props.position.lon===null?"":props.position.lon}
                onChange={(e) => {props.changePosition("lon", e.target.value)}}
            />
        </div>
        <div className="input_coord">
            <p>Долгота</p>
            <input type="number"
                placeholder="Координата"
                min={0}
                max={90}
                step={0.1}
                value={props.position.lat===null?"":props.position.lat}
                onChange={(e) => {props.changePosition("lat", e.target.value)}}
            />
        </div>
        <div className="azimuth">
            <p>Азимут</p>
            <input type="number"
                placeholder="0"
                min={0}
                max={360}
                step={1}
                value={props.position.azimuth===null?0:props.position.azimuth}
                onChange={(e) => {props.changePosition("azimuth", e.target.value)}}
            />
            <input type="range"
                min={0}
                max={360}
                step={1}
                value={props.position.azimuth===null?0:props.position.azimuth}
                onChange={(e) => {props.changePosition("azimuth", e.target.value)}}
            />
        </div>
        <button className="map_button" onClick={setDevice}>Установить</button>
        <button className="map_button" onClick={clear}>Сбросить</button>
    </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => {dispatch(updateModal(data))}
}}
export default connect(mapStateToProps, mapDispatchToProps)(MapInput)
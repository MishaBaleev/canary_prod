import { useState } from "react";
import "./LogReader.scss";
import SelectFile from "./SelectFile/SelectFile";
import LogShow from "./LogShow/LogShow";
import axios from "axios";
import { connect } from "react-redux";
import { updateModal } from "../../AppSlice";

const LogReader = (props) => {
    const [log_data, setLogData] = useState(null)

    const getData = (e) => {
        let data = new FormData()
        data.append("file", new Blob([e.target.files[0]]))
        axios.post("http://127.0.0.1:8001/getLogData", data).then(response => {
            if (response.data.result === false){
                props.updateModal({title: "Ошибка открытия лога", message: "При открытии лога произошла ошибка"})
            }else{
                setLogData({
                    log_name: e.target.files[0].name,
                    data: response.data.log_data
                })
            }
        })
    }

    const refresh = () => {
        setLogData(null)
    }

    return <div className="log_reader">
        {(log_data === null)?
            <SelectFile getData={getData}/>:
            <LogShow data={log_data} refresh={refresh}/>
        }
    </div>
}
const mapStateToProps = (state) => {return state}
const mapDispatchToProps = (dispatch) => {return {
    "updateModal": (data) => dispatch(updateModal(data))
}}
export default connect(mapStateToProps, mapDispatchToProps)(LogReader)
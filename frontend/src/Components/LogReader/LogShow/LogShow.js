import "./LogShow.scss";
import LogNav from "./LogNav/LogNav";
import LogGraph from "./LogGraph/LogGraph";
import LogData from "./LogData/LogData";
import { useState } from "react";

const LogShow = (props) => {
    const [cur_frame, setCurFrame] = useState(props.data.data[0])
    const setCurFrameId = (id) => {
        let new_frame = {...props.data.data[id]}
        setCurFrame(new_frame)

        let new_arrs = {...cur_arrs}
        let arr_keys = {"type_2400": "arr_2400", "type_915": "arr_915", "type_5800": "arr_5800"}
        let type_key = JSON.parse(new_frame.frame).type
        new_arrs[arr_keys[type_key]] = JSON.parse(new_frame.frame).arr
        setCurArrs(new_arrs)

        let cur_zones_new = {...cur_zones}
        let zone_keys = {"type_2400": "zone_2400", "type_915": "zone_915", "type_5800": "zone_5800"}
        cur_zones_new[zone_keys[type_key]] = parseInt(new_frame.zone_state)
        setCurZones(cur_zones_new)

        let cur_notes_new = []
        for (let i=0; i<=id; i++){
            let notes = JSON.parse(props.data.data[i].note)
            notes.forEach(note => {
                cur_notes_new.push({
                    id: i,
                    note: note
                })
            })
        }
        setCurNotes(cur_notes_new)
    }

    const [cur_arrs, setCurArrs] = useState({
        arr_2400: Array(82).fill(0),
        arr_915: Array(101).fill(0),
        arr_5800: Array(39).fill(0)
    })
    const [cur_zones, setCurZones] = useState({
        zone_2400: 0,
        zone_915: 0,
        zone_5800: 0
    })
    const [cur_notes, setCurNotes] = useState([])

    return <div className="log_show">
        <div className="section_1">
            <LogGraph
                cur_arrs={cur_arrs}
            />
            <LogNav 
                setCurFrame={setCurFrameId}
                cur_frame={cur_frame}
                start_time={props.data.data[0].time}
                length={props.data.data.length}
                refresh={props.refresh}
            />
        </div>
        <LogData 
            log_name={props.data.log_name}
            cur_arrs={cur_arrs}
            cur_zones={cur_zones}
            cur_notes={cur_notes}
        />
    </div>
}
export default LogShow
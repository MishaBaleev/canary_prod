
const CommonData = (props) => {
    let ranges = [
        {name: "2.4 Мгц", length: 82, zone_key: "zone_2400", arr_key: "arr_2400"},
        {name: "915 Ггц", length: 51, zone_key: "zone_915", arr_key: "arr_915"},
        {name: "5.8 Ггц", length: 39, zone_key: "zone_5800", arr_key: "arr_5800"}
    ]

    const getPayload = (arr_key) => {
        let arr = props.cur_arrs[arr_key]
        let counter = 0 
        arr.forEach(item => {
            if (item > 0) {counter++}
        })
        return counter
    }

    const states_2400 = ["Нет аномалий", "Ручное управление БПЛА", "Управление БПЛА по Wi-Fi", "Wi-Fi-speedtest download", "Wi-Fi-speedtest upload"]
    const states_915 = ["Нет аномалий", "Аномалия телеметрии"]
    const states_5800 = ["Нет аномалий"]
    const states = {
        "zone_2400": states_2400,
        "zone_915": states_915,
        "zone_5800": states_5800
    }

    return <div className="common_data block">
        <div className="data_block">
            <div className="title_block"><p>Аномалии</p></div>
            {ranges.map((item, index) => {
                return <div className="item_block" key={index}>
                    <p>Диапазон {item.name}:</p>
                    <p>{states[item.zone_key][props.cur_zones[item.zone_key]]}</p>
                </div>
            })}
        </div>
        <div className="data_block">
            <div className="title_block"><p>Загруженность каналов</p></div>
            {ranges.map((item, index) => {
                return <div className="item_block" key={index}>
                    <p>Диапазон {item.name}: {getPayload(item.arr_key)}/{item.length} частот</p>
                </div>
            })}
        </div>
        <div className="data_block">
            <div className="title_block"><p>Комментарии</p></div>
            {props.cur_notes.length!==0?
                props.cur_notes.map((note, index) => {
                    return <div className="item_block" key={index}>
                        <p>Пакет № {note.id}: {note.note}</p>
                    </div>
                }):
                <div className="item_block">
                    <p>Отсутствуют</p>
                </div>
            }
        </div>
    </div>
}
export default CommonData
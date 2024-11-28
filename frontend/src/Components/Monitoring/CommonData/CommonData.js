import "./ComonData.scss";
import RangeCard from "./RangeCard";

const CommonData = (props) => {
    const ranges = [
        {
            title: "2.4 Ггц",
            max: 50,
            key: "arr_2400",
            zone: "zone_2400",
            x_ticks: Array(82).fill(0).map((_, index) => {return index + 2400})
        },
        {
            title: "915 Мгц",
            max: 100,
            key: "arr_915",
            zone: "zone_915",
            x_ticks: Array(51).fill(0).map((_, index) => {return index + 870})
        },
        {
            title: "5.8 Ггц",
            max: 120,
            key: "arr_5800",
            zone: "zone_5800",
            x_ticks: ['5645', '5658', '5665', '5685', '5695', '5705', '5725', '5732', '5733', '5740', '5745', '5752', '5760', '5765', '5769', '5771', '5780', '5785', '5790', '5800', '5805', '5806', '5809', '5820', '5825', '5828', '5840', '5843', '5845', '5847', '5860', '5865', '5866', '5880', '5885', '5905', '5917', '5925', '5945']
        },
    ]

    return <div className="common_data plate_big">
        {ranges.map((item, index) => {
            return <RangeCard key={index}
                title={item.title}
                data={props.frame.frame[item.key]}
                max={item.max}
                zone_state={props.frame.zone_state[item.zone]}
                zone_key={item.zone}
                x_ticks={item.x_ticks}
            />
        })}
    </div>
}
export default CommonData
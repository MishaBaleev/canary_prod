import "./LogGraph.scss";
import LogGraphCard from "./LogGraphCard";

const LogGraph = (props) => {
    let ranges = [
        {
            title: "2.4 Ггц",
            data: props.cur_arrs.arr_2400,
            max: 50,
            x_ticks: Array(82).fill(0).map((_, index) => {return index + 2400})
        },
        {
            title: "915 Мгц",
            data: props.cur_arrs.arr_915,
            max: 100,
            x_ticks: Array(51).fill(0).map((_, index) => {return index + 870})
        },
        {
            title: "5.8 Ггц",
            data: props.cur_arrs.arr_5800,
            max: 120,
            x_ticks: ['5645', '5658', '5665', '5685', '5695', '5705', '5725', '5732', '5733', '5740', '5745', '5752', '5760', '5765', '5769', '5771', '5780', '5785', '5790', '5800', '5805', '5806', '5809', '5820', '5825', '5828', '5840', '5843', '5845', '5847', '5860', '5865', '5866', '5880', '5885', '5905', '5917', '5925', '5945']
        },
    ]
    return <div className="log_graph">
        {ranges.map((item, index) => {
            return <LogGraphCard key={index}
                title={item.title}
                data={item.data}
                max={item.max}
                x_ticks={item.x_ticks}
            />
        })}
    </div>
}
export default LogGraph
import { Bar } from "react-chartjs-2";

const RangeCard = (props) => {
    let data = {
        labels: props.x_ticks,
        color: "whitesmoke",
        datasets: [{
            data: props.data,
            label: "",
            backgroundColor: "#00ff00",
            fill: true
        }] 
    }
    let options = {
        plugins: {
            legend: {
                display: false
            }
        },
        scales:{
            y:{
                grid:{
                    color: "whiteSmoke"
                },
                suggestedMin: 0, suggestedMax: props.max,
                ticks:{
                    color: "whitesmoke"
                }
            },
            x:{
                grid:{
                    color: "whitesmoke"
                },
                ticks:{
                    color: "whitesmoke"
                }
            }
        }
    }
    const states_2400 = ["Нет аномалий", "Ручное управление БПЛА", "Управление БПЛА по Wi-Fi", "Wi-Fi-speedtest download", "Wi-Fi-speedtest upload"]
    const states_915 = ["Нет аномалий", "Аномалия телеметрии"]
    const states_5800 = ["Нет аномалий", "Аномалия"]
    const states = {
        "zone_2400": states_2400,
        "zone_915": states_915,
        "zone_5800": states_5800
    }
    return <div className="range_card">
        <p className="title">{props.title}</p>
        <div className="graph">
            <Bar type="Bar" options={options} data={data}/>
        </div>
        <div className={"analize "+(props.zone_state===0?"good":"bad")}>
            <p>{states[props.zone_key][props.zone_state]}</p>
        </div>
    </div>
}
export default RangeCard
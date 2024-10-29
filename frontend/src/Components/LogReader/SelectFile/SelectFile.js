import "./SelectFile.scss";

const SelectFile = (props) => {
    return <div className="select_file">
        <label className="input_file">
            <input 
                type="file" 
                className="input" 
                accept=".db" 
                onChange={props.getData}
            />
            <span>Выберите файл</span>
        </label>
    </div>
}
export default SelectFile
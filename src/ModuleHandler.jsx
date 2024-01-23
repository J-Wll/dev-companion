// import Module from './Module'
import './css/App.css';
import './css/ModuleHandler.css'

export default function ModuleHandler(moduleList) {
    console.log(moduleList);
    return (
        <div className="module-container">
                {moduleList.moduleList}
        </div>)
}
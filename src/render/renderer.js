/**
 * Created by lucas63 on 19.06.17.
 */


function Renderer(_map){
    this.map = _map;

    this.map_color = "";
    this.road_color = "";
    this.dotted_line_color = "";
    this.boiled_line_color = "";
    this.road_side_line_color = "";

    render_map(this.map);
}



// конфигурация путекй вверх направо прямо
Renderer.prototype.update_map = function () {

};

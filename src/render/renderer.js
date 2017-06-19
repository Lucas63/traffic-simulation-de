/**
 * Created by lucas63 on 19.06.17.
 */


function Renderer(_map){
    this.map_object = _map;

    this.canvas = document.getElementById('canvas_map');
    this.context = this.canvas.getContext('2d');

    this.map_color = "";
    this.road_color = "";
    this.dotted_line_color = "";
    this.boiled_line_color = "";
    this.road_side_line_color = "";


}

Renderer.prototype.draw_map = function(){
    render_map(this);
};

// конфигурация путекй вверх направо прямо
Renderer.prototype.update_map = function () {

};

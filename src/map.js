/**
 * Created by lucas63 on 11.06.17.
 */

function Map(_roads,_junctions,_turns,_onramps,_offramps){

    this.roads = _roads;
    this.junctions = _junctions;
    this.turns = _turns;
    this.onramps = _onramps;
    this.offramps = _offramps;

}

Map.prototype.render_map = function(){
  render_map();
};
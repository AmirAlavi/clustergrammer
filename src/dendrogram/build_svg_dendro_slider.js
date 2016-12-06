var change_groups = require('./change_groups');
var position_svg_dendro_slider = require('./position_svg_dendro_slider');

module.exports = function build_svg_dendro_slider(cgm, inst_rc){

  console.log('build svg sliders: ' + inst_rc)

  var slider_length = 100;

  var drag = d3.behavior.drag()
      // .origin(function(d) {
      //   return {x: d[0], y: d[1]};
      // })
      .on("drag", dragging)
      .on('dragend', function(){
        cgm.params.is_slider_drag = false;
      })

  var main_svg = d3.select('.viz_svg');

  var slider_group = d3.select(cgm.params.root +' .viz_svg')
      .append('g')
      .classed( inst_rc + '_slider_group', true);

  position_svg_dendro_slider(cgm, inst_rc);

    slider_group
      .append("line")
      .style('stroke-width', slider_length/20+'px')
      .style('stroke', 'black')
      .style('stroke-linecap', 'round')
      .style('opacity', 0.20)
      .attr("y1", 0)
      .attr("y2", function(){
        return slider_length-2;
      })
      .on('click', click_dendro_slider)

    var default_opacity = 0.35;
    var high_opacity = 0.6;
    slider_group
      .append('circle')
      .classed(inst_rc+'_group_circle', true)
      .attr('r', slider_length * 0.08)
      .attr('transform', function(){
        return 'translate(0, '+slider_length/2+')';
      })
      .style('fill', 'blue')
      .style('opacity', default_opacity)
      .on('mouseover', function(){
        d3.select(this).style('opacity', high_opacity)
      })
      .on('mouseout', function(){
        d3.select(this).style('opacity', default_opacity)
      })
      .call(drag);

    slider_group
      .append('path')
      .style('fill', 'black')
      .attr('transform', 'translate('+slider_length/10+', 0)')
      .attr('d', function(d) {

        // up triangle
        var start_x = 0 ;
        var start_y = -2;

        var mid_x = 0;
        var mid_y = slider_length;

        var final_x = slider_length/10;
        var final_y = -2;

        var output_string = 'M' + start_x + ',' + start_y + ', L' +
        mid_x + ', ' + mid_y + ', L'
        + final_x + ','+ final_y +' Z';

        return output_string;
      })
      .style('opacity', 0.35)

  function dragging() {

    cgm.params.is_slider_drag = true;

    // d[0] = d3.event.x;
    var slider_pos = d3.event.y;

    if (slider_pos < 0){
      slider_pos = 0;
    }

    if (slider_pos > slider_length){
      slider_pos = slider_length;
    }

    if (this.nextSibling) this.parentNode.appendChild(this);

    slider_pos = d3.round(slider_pos, -1);

    var slider_value = 10 - slider_pos/10;

    d3.select(this).attr("transform", "translate(0, " + slider_pos + ")");

    // console.log('slider_value: ' + String(slider_value))

    change_groups(cgm, inst_rc, slider_value);

  }


  function nozoom() {
    d3.event.preventDefault();
  }

  function click_dendro_slider(d){

    var clicked_line_position = d3.mouse(this)

    var rel_pos;

    rel_pos = d3.round(clicked_line_position[1], -1)

    d3.select(cgm.params.root+ ' .'+inst_rc+'_group_circle')
      .attr('transform', 'translate(0, '+ rel_pos + ')');

    var slider_value = 10 - rel_pos/10;

    change_groups(cgm, inst_rc, slider_value);

  }
};
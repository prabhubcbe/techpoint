// @ts-nocheck
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-radial-stacked-chart',
  templateUrl: './radial-stacked-chart.component.html',
  styleUrls: ['./radial-stacked-chart.component.scss'],
})
export class RadialStackedChartComponent implements OnChanges {
  @Input
  data: any[];

  @Input
  svgHeight: any;

  @Input
  maxScore: int = 10;

  constructor(private eleRef: ElementRef) {}

  ngOnChanges(): void {
    if (this.data && this.data.length) {
      this.drawPlot();
    }
  }

  drawPlot(): void {
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = 200 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom,
      innerRadius = 10,
      outerRadius = Math.min(width, height) / 2; // the outerRadius goes from the middle of the SVG area to the border

    var svg = d3
      .select(this.eleRef.nativeElement.querySelector('div'))
      .append('svg')
      .attr(
        'viewBox',
        `${-width / 1.5} ${-height / 1.5} ${width + 80} ${height + 80}`
      )
      .attr(
        'style',
        `width: 100%; height: ${
          this.svgHeight || 'auto'
        }; font: 10px sans-serif;`
      )
      .attr('transform', 'rotate(180 0 0)');

    const greenColorItems = ['PROFESSION', 'PURPOSE', 'REWARD', 'SPIRIT'];

    const orgNames = ['org_value', 'latest_value'];
    const data = orgNames
      .map((og) =>
        this.data.map((item) => {
          return {
            organizationName: og,
            orgCode: item.category,
            count: item[`${og}`],
          };
        })
      )
      .reduce((partial, a) => [...partial, ...a], []);

    const series = d3
      .stack()
      .keys(d3.union(data.map((d) => d.organizationName))) // distinct series keys, in input order
      .value(([, D], key) => {
        return D.get(key).count;
      })(
      // get value for each series key and stack
      d3.index(
        data,
        (d) => d.orgCode,
        (d) => d.organizationName
      )
    ); // group by stack then series key

    const arc = d3
      .arc() // imagine your doing a part of a donut plot
      .innerRadius((d: any) => y(d[0]))
      .outerRadius((d: any) => y(d[1]))
      .startAngle(function (d) {
        return x(d.data[0]);
      })
      .endAngle(function (d) {
        return x(d.data[0]);
      });
    // .padRadius(innerRadius)
    // .padAngle(0.1 / innerRadius)
    // .cornerRadius(.5)

    // Scales
    var x = d3
      .scaleBand()
      .domain(data.map((oc) => oc.orgCode)) // The domain of the X axis is the list of states.
      .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0);

    var y = d3
      .scaleRadial()
      .domain([0, d3.max(data, (d) => d.count)]) // Domain of Y is from 0 to the max seen in the data
      .range([innerRadius, outerRadius]); // Domain will be define later.

    const color = d3
      .scaleOrdinal()
      .domain(orgNames)
      //.range(d3.schemeSpectral[orgNames.length + 1])
      .range(['#5DBEEC', '#8B75D7'])
      .unknown('#ccc');

    const color2 = d3
      .scaleOrdinal()
      .domain(orgNames)
      //.range(d3.schemeSpectral[orgNames.length + 1])
      .range(['#B6DF5C', '#829D46'])
      .unknown('#ccc');

    svg
      .selectAll()
      .data(series.slice(1))
      .join('g')
      .selectAll('path')
      .data((D) => D.map((d: any) => ((d.key = D.key), d)))
      .join('g')
      .append('rect')
      .attr('fill', (d) => {
        return greenColorItems.includes(d.data[0].toUpperCase())
          ? color2(d.key)
          : color(d.key);
      })
      .attr('y', 0)
      .attr('transform', function (d) {
        const trans = 'rotate(' + x(d.data[0]) * (180 / Math.PI) + ')';
        //  console.log("path", arc(d), "rotate", trans, 'startAngle', arc.startAngle()(d), "endAngle", arc.endAngle()(d))
        return trans;
      })
      .attr('width', 12)
      .attr('rx', '3px')
      .attr('height', (d) => y(d[1] - d[0]))
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke', 'white')
      .append('title')
      .attr('text-anchor', 'middle')
      .text((d: any) => `${d.data[0]} ${(d[1] - d[0]).toFixed(2)}/${this.maxScore}`);

    svg
      .append('circle')
      .attr('r', innerRadius + 2)
      .style('fill', 'white');

      svg.append('rect')
      .attr('fill', (d) => {
        return color(orgNames[1]);
      })
      .attr("transform", `rotate(180)translate(-${width/2 + 20},${height/1.30 - 10})`)
      .attr('width', 12)
       .attr('height', 12)

      svg.append("g")
      .attr("transform", `rotate(180)translate(-${width/2},${height/1.30})`)
      .append('text')
          .style("font-weight", "bold")
          .style("font-size", "12")
          .text((d1: any) => "Soft Skills")

          svg.append('rect')
          .attr('fill', (d) => {
            return color2(orgNames[1]);
          })
          .attr("transform", `rotate(180)translate(${width/2 - 70},${height/1.30 - 10})`)
          .attr('width', 12)
          .attr('height', 12)

          svg.append("g")
          .attr("transform", `rotate(180)translate(${width/2 - 50},${height/1.30})`)
          .append('text')
              .style("font-weight", "bold")
              .style("font-size", "12")
              .text((d1: any) => "Aptitude")



    // Add the labels
    svg
      .selectAll()
      .data(series.slice(1))
      .join('g')
      .selectAll('path')
      .data((D) => D.map((d: any) => ((d.key = D.key), d)))
      .join('g')
      .attr('transform', (d) => {
      const angle = x(d.data[0]) * (180 / Math.PI);
      // console.log('g rotate', angle, "d", d.data[0].toUpperCase().substring(0, 2));
      if (angle < 180) {
      return 'translate(12)';
      } else if (angle === 180) {
      return 'translate(0,-6)';
      } else if (angle > 180 && angle <= 225) {
      return 'translate(0,-12)';
      } else if (angle > 225 && angle <= 290) {
      return 'translate(6,-12)';
      } else {
      return 'translate(12,0)';
      }
      })
      .attr('class', 'topLabel')
      .append('text')
      .attr('transform', (d) => {
        var centroid = arc.centroid(d);
        var path = arc(d).split('L')[0].substring(1);
        var c0 = parseInt(path.split(',')[0]),
          c1 = parseInt(path.split(',')[1]);
        var rotate = 'rotate(' + x(d.data[0]) * (180 / Math.PI) + ')';
        // console.log("path", arc(d), "angle", (x(d.data[0]) * (180 / Math.PI)),"d1",d.data[1], "d", d.data[0].toUpperCase().substring(0, 2), "centroid", centroid );
        return `rotate(180)translate(${c0 * 0.9},${c1 * 0.9})`;
      })
      .text(function (d) {
        const len = greenColorItems.includes(d.data[0].toUpperCase()) ? 1 : 2;
        return d.data[0].toUpperCase().substring(0, len);
      })
      .style('font-size', '12px');
  }
}

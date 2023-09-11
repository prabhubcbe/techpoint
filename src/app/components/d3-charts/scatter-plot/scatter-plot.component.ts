// @ts-nocheck
import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from '../data/data.model';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnChanges {
  @Input
  data: any;

  @Input
  scatterplot: any;

  @Input
  bubbleColor: any = "#672024";

  constructor(private eleRef: ElementRef) {

  }

  ngOnChanges(): void {
    if (this.data && this.data.length) {
      this.drawPlot();
    }
  }

  drawPlot(): void {

    let circles = 0;
     this.data.map(d => circles = circles + d.averageScores.length);

    // set the dimensions and margins of the graph
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width = (circles * 100) - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

    d3.select(this.eleRef.nativeElement.querySelector('div')).select("svg").remove();

    // append the svg object to the body of the page
    var Svg = d3.select(this.eleRef.nativeElement.querySelector('div')).append('svg')
      .attr("viewBox", `${-40} ${-height / 3} ${width * 1.15} ${height * 1.75}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;")
      .attr("class", this.scatterplot)

    const midYValue = d3.max(this.data, d => d.count) / 2;

    var x = d3.scaleLinear()
      .domain([100, 0])
      .range([0, width])

    Svg.append("g")
      .attr("transform", "translate(10," + (height) + ")")
      .style("font-weight", "700")
      .style("font-size", "16px")
      .call(d3.axisBottom(x).tickSize(-height).ticks(5).tickFormat(d => `${this.data.find(i => i.key === d) ? this.data.find(i => i.key === d)?.count : ''}`))
      .select(".domain").remove()



    Svg.append("g")
      .attr("transform", `translate(10, -10)`)
      .attr("class", "topTick")
      .style("font-weight", "700")
      .style("font-size", "16px")
      .call(d3.axisTop(x).ticks(5).tickFormat(d => this.data.find(i => i.key === d)?.topText))
      .select(".domain").remove()

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.count)])
      .range([height, 0])
      .nice()
    Svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("opacity", "0")
      .select(".domain").remove()

    Svg.append("line")
      .attr("x1", "10")
      .attr("y1", y(midYValue))
      .attr("x2", width + 10)
      .attr("y2", y(midYValue))
      .attr("stroke", "#0C141D")
      .attr("stroke-width", 2)

      Svg.append("g")
      .append('text')
          .attr("x", width/2 - 100)
          .attr("y", height + 50)
          .style("font-weight", "bold")
          .style("font-size", "16")
          .text((d1: any) => "# Number of People")

    // Customization
    Svg.selectAll(".tick line").attr("stroke", "#0C141D")

    Svg.selectAll(".topTick line").attr("stroke", "none")

    Svg.selectAll(".tick text").attr("x", "80px")

    this.data?.map(d => {
      const maxXValue = x(d3.max(d.records, r => r.score));
      const minXValue = x(d3.min(d.records, r => r.score));
      const gSvg = Svg.append('g');
      d.averageScores.map(r => {
        gSvg.append("circle")
          .attr("cx", function () {
            return x(r.average)
          })
          .attr("cy", y(midYValue))
          .attr("r", d.display <= 10 ? 10 : d.display)
          .style("fill", this.bubbleColor)
          .style("opacity", "60%")
          .on("mouseover", (event, i) => {
            const currentRect = d3.select("."+this.scatterplot).select(".toolTipRect" + r.average);
            currentRect.style("opacity", 1);
            const currentText = d3.select("."+this.scatterplot).select(".toolTipText" + r.average);
            currentText.style("opacity", 1);
          })
          .on("mouseout", (event, i) => {
            const currentRect = d3.select("."+this.scatterplot).select(".toolTipRect" + r.average);
            currentRect.style("opacity", 0);
            const currentText = d3.select("."+this.scatterplot).select(".toolTipText" + r.average);
            currentText.style("opacity", 0);
          });

        gSvg.append('rect')
        .style("opacity", 0)
        .attr("class", "toolTipRect" + r.average)
          .attr("x", function () {
            return x(r.average)
          })
          .attr("y", y(midYValue) / 2)
          .style("fill", "white")
          .style("width", r.count.toString().length * 20)
          .style("height", 30)

          gSvg.append('text')
          .style("opacity", 0)
          .attr("class", "toolTipText" + r.average)
          .attr("x", function () {
            return x(r.average)
          })
          .attr("y", y(midYValue) - 30)
          .style("font-weight", "bold")
          .style("font-size", "16")
          .text((d1: any) => ""+ r.average + "% Fit")
      })
    })
    // Add dots

  }
}

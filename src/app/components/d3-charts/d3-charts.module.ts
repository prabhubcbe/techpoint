import { NgModule } from '@angular/core';

import { RadialStackedChartComponent } from './radial-stacked-chart/radial-stacked-chart.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';

@NgModule({
  declarations: [
    RadialStackedChartComponent,
    ScatterPlotComponent,
  ],
  exports: [
    RadialStackedChartComponent,
    ScatterPlotComponent,
  ]
})
export class D3ChartsModule {}

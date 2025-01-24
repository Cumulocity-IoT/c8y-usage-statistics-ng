import { Component, OnInit } from "@angular/core";
import {
  ProductCategory,
  MicroserviceConfigurationService,
  Api,
} from "../../../microservice-statistics/microservice-configuration/microservice-configuration.service";
import {
  MonthlyMicroserviceProdCategoryMap,
  MicroserviceStatisticsService,
  CLASS_COLORS,
} from "../../../microservice-statistics/microservice-statistics.service";
import { MonthPickerService } from "../../../utitities/statistics-action-bar/month-picker/month-picker.service";
import { CommonService, FeatureList } from "../../../common.service";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { COLUMN_FIELDS } from "../../../microservice-statistics/microservice-data/microservice-data.service";
import { gettext } from "@c8y/ngx-components";
const d3 = require("d3");

const ALL_MICROSERVICES = "All Microservices"

@Component({
  selector: "app-services-overview",
  templateUrl: "./services-overview.component.html",
  styleUrls: ["./services-overview.component.css"],
})
export class ServicesOverviewComponent implements OnInit {
  feature = FeatureList.MicroserviceStatistics;
  monthChangedSubscription: Subscription;
  tenantChangedSubscription: Subscription;
  form: FormGroup;
  productCategoryNames: string[];
  chartData: MonthlyMicroserviceProdCategoryMap[];
  isLoading = true;
  COLUMN_FIELDS = COLUMN_FIELDS;
  showAlert = false;

  VIEW_CATEGORY = {
    MEMORY: "memory",
    CPU: "cpu",
  };
  constructor(
    private fb: FormBuilder,
    private monthPickerService: MonthPickerService,
    private microserviceConfigurationService: MicroserviceConfigurationService,
    private microserviceStatisticsService: MicroserviceStatisticsService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    try {
      this.monthChangedSubscription = this.monthPickerService.dateChanged.subscribe((selectedDate: Date) => {
        this.loadDataGenerateCharts(selectedDate);
      });
      this.tenantChangedSubscription = this.commonService.tenantChanged.subscribe((tenantId: string) => {
        this.loadDataGenerateCharts();
      })
      setTimeout(() => {
        this.loadDataGenerateCharts();
        this.isLoading = false;
      }, 5000);
    }
    catch (err) {
      console.log(gettext('Error in chart generation'))
      console.error(err.message);
    }
  }

  private async loadDataGenerateCharts(
    selectedDate = this.monthPickerService.selectedDate
  ) {
    try {
      const productCategories: ProductCategory[] =
        await this.microserviceConfigurationService.getCategories(
          Api.Product,
          false
        );
      const monthlyMicroserviceProdCategoryMap: MonthlyMicroserviceProdCategoryMap[] =
        await this.microserviceStatisticsService.getMonthlyMicroserviceProdCategoryMap(
          selectedDate
        );

      this.productCategoryNames = productCategories.map(
        (elem) => elem.productCategory
      );
      this.productCategoryNames.unshift(ALL_MICROSERVICES);
      this.form = this.fb.group({
        productCategory: [ALL_MICROSERVICES, Validators.required],
      });
      const chartData = this.getChartData(
        monthlyMicroserviceProdCategoryMap,
        ALL_MICROSERVICES
      );

      this.form.valueChanges.subscribe((value) => {
        const chartData = this.getChartData(
          monthlyMicroserviceProdCategoryMap,
          value.productCategory
        );
        this.generateChart(chartData);
      });
      this.generateChart(chartData);
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
    finally {
      this.showAlert = !this.chartData
    }
  }

  private generateChart(chartData: MonthlyMicroserviceProdCategoryMap[]) {
    this.chartData = chartData;
    const chartContainerCpu = d3.select(".chart-area-service-cpu");
    const chartContainerMemory = d3.select(".chart-area-service-memory");
    chartContainerCpu.selectAll("svg").remove();
    chartContainerMemory.selectAll("svg").remove();
    if (this.chartData.length === 0) {
      return
    }
    const parentContainerDimensions = d3
      .select(".service-block")
      .node()
      .getBoundingClientRect();
    const chartContainerCpuDimensions = chartContainerCpu
      .node()
      .getBoundingClientRect();
    const chartContainerMemoryDimensions = chartContainerMemory
      .node()
      .getBoundingClientRect();

    const baseWidth = parentContainerDimensions.width - 20;
    const baseHeight = parentContainerDimensions.height / 2 - 10;

    const MARGIN = { TOP: 10, RIGHT: 10, BOTTOM: 10, LEFT: 10 },
      width = baseWidth - MARGIN.LEFT - MARGIN.RIGHT,
      height = baseHeight - MARGIN.TOP - MARGIN.BOTTOM;

    const svgWidth = width + MARGIN.LEFT + MARGIN.RIGHT;
    const svgHeight = height + MARGIN.TOP + MARGIN.BOTTOM;

    const svgCpu = chartContainerCpu
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    const svgMemory = chartContainerMemory
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const chartContainerCpuUnit = svgCpu
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);
    const chartContainerMemoryUnit = svgMemory
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    const cpuCenter = {
      cx: chartContainerCpuDimensions.height / 2,
      cy: chartContainerCpuDimensions.height / 2,
    };
    const memoryCenter = {
      cx: chartContainerMemoryDimensions.height / 2,
      cy: chartContainerMemoryDimensions.height / 2,
    };

    chartContainerCpuUnit
      .append("text")
      .attr("x", cpuCenter.cx)
      .attr("y", cpuCenter.cy + 8)
      .text(() => chartData.reduce((total, elem) => total + Number(elem.avgCpu), 0).toFixed(2))
      .attr("text-anchor", "middle");
    chartContainerMemoryUnit
      .append("text")
      .attr("x", memoryCenter.cx)
      .attr("y", memoryCenter.cy + 8)
      .text(() => chartData.reduce((total, elem) => total + Number(elem.avgMemory), 0).toFixed(2))
      .attr("text-anchor", "middle");

    const outerRadius =
      chartContainerCpuDimensions.height / 2 - MARGIN.TOP - MARGIN.BOTTOM;
    const innerRadius =
      chartContainerCpuDimensions.height / 2 - MARGIN.TOP - MARGIN.BOTTOM - 30;

    const TOTAL_AREA = 2 * Math.PI;

    const totalMemory = chartData.reduce(
      (total, elem) => total + Number(elem.avgMemory),
      0
    );
    const totalCpu = chartData.reduce((total, elem) => total + Number(elem.avgCpu), 0);

    const memoryDistribution = chartData.map(
      (elem) => (Number(elem.avgMemory) / totalMemory) * TOTAL_AREA
    );
    const cpuDistribution = chartData.map(
      (elem) => (Number(elem.avgCpu) / totalCpu) * TOTAL_AREA
    );
    const cpuArcData = [];
    const memoryArcData = [];

    memoryDistribution.reduce((total, elem) => {
      memoryArcData.push({
        startAngle: total,
        endAngle: total + elem,
      });
      return total + elem;
    }, 0);

    cpuDistribution.reduce((total, elem) => {
      cpuArcData.push({
        startAngle: total,
        endAngle: total + elem,
      });
      return total + elem;
    }, 0);

    const arcGenerator = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(function (d) {
        return d.startAngle;
      })
      .endAngle(function (d) {
        return d.endAngle;
      })
      .padAngle(0.02)
      .padRadius(100);

    chartContainerMemoryUnit
      .selectAll("path")
      .data(memoryArcData)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => CLASS_COLORS[i % CLASS_COLORS.length])
      .attr("class", (d, i) => `path-${i}`)
      .attr("transform", `translate(${memoryCenter.cx}, ${memoryCenter.cy})`)
      .append('title')
      .text((d, i) => `${chartData[i].microserviceName}, 💾 ${chartData[i].avgMemory}, ${((Number(chartData[i].avgMemory) / totalMemory) * 100).toFixed(2)}%`);

    chartContainerCpuUnit
      .append("text")
      .text("CPU")
      .attr("x", `${cpuCenter.cx}`)
      .attr("y", `${cpuCenter.cy - 8}`)
      .attr("text-anchor", "middle");

    chartContainerMemoryUnit
      .append("text")
      .text("Memory")
      .attr("x", `${memoryCenter.cx}`)
      .attr("y", `${memoryCenter.cy - 8}`)
      .attr("text-anchor", "middle");

    chartContainerCpuUnit
      .selectAll("path")
      .data(cpuArcData)
      .join("path")
      .attr("d", arcGenerator)
      .attr("fill", (d, i) => CLASS_COLORS[i % CLASS_COLORS.length])
      .attr("class", (d, i) => `path-${i}`)
      .attr("transform", `translate(${cpuCenter.cx}, ${cpuCenter.cy})`)
      .append('title')
      .text((d, i) => `${chartData[i].microserviceName}, 🖥 ${chartData[i].avgCpu}, ${((Number(chartData[i].avgCpu) / totalCpu) * 100).toFixed(2)}%`);
  }

  private getChartData(
    monthlyMicroserviceProdCategoryMap: MonthlyMicroserviceProdCategoryMap[],
    productCategory: string
  ): MonthlyMicroserviceProdCategoryMap[] {
    if (productCategory && productCategory !== ALL_MICROSERVICES) {
      const chartData = monthlyMicroserviceProdCategoryMap.filter(
        (elem) => elem.productCategory === productCategory
      );
      return chartData;
    }
    else {
      return monthlyMicroserviceProdCategoryMap;
    }
  }

  highlightChartArea(index) {
    d3.selectAll(`.path-${index}`).attr("fill-opacity", "0.5");
  }
  removeHighlightedChartArea(index) {
    d3.selectAll(`.path-${index}`).attr("fill-opacity", "1");
  }

  getTotalAvgCpuOrMemory(category){
    if(category === this.VIEW_CATEGORY.CPU){
      return this.chartData.reduce((tot, elem)=> tot + +elem.avgCpu, 0).toFixed(2)
    }
    else if(category === this.VIEW_CATEGORY.MEMORY){
      return this.chartData.reduce((tot, elem)=> tot + +elem.avgMemory, 0).toFixed(2)
    }

  }

  ngOnDestroy(): void {
    if (this.monthChangedSubscription) {
      this.monthChangedSubscription.unsubscribe()
    }
    if (this.tenantChangedSubscription) {
      this.tenantChangedSubscription.unsubscribe()
    }
  }
}

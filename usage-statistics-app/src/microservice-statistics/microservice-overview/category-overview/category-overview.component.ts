import { Component, OnInit } from "@angular/core";
import { MonthPickerService } from "../../../utitities/statistics-action-bar/month-picker/month-picker.service";
import { CommonService, FeatureList } from "../../../common.service";
import {
  CLASS_COLORS,
  MicroserviceStatisticsService,
  MonthlyMicroserviceProdCategoryMap,
} from "../../../microservice-statistics/microservice-statistics.service";
import { Subscription } from "rxjs";
import {
  Api,
  MicroserviceConfigurationService,
  ProductCategory,
} from "../../../microservice-statistics/microservice-configuration/microservice-configuration.service";
import { gettext } from "@c8y/ngx-components";
import { COLUMN_FIELDS } from "../../../microservice-statistics/microservice-data/microservice-data.service";
const d3 = require("d3");

@Component({
  selector: "app-category-overview",
  templateUrl: "./category-overview.component.html",
  styleUrls: ["./category-overview.component.css"],
})
export class CategoryOverviewComponent implements OnInit {
  feature = FeatureList.MicroserviceStatistics;
  monthChangedSubscription: Subscription;
  tenantChangedSubscription: Subscription;
  productCategories: ProductCategory[];
  thresholds: object = {};
  monthlyMicroserviceProdCategoryMap: MonthlyMicroserviceProdCategoryMap[];
  chartData: object;
  isLoading = true;
  showAlert = false

  VIEW_CATEGORY = {
    COUNT: "count",
    MEMORY_CPU: "memory_cpu",
  };
  viewCategory = this.VIEW_CATEGORY.MEMORY_CPU;

  constructor(
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
      }, 1000);
    } catch (err) {
      console.log(gettext("Error in chart generation"));
      console.error(err.message);
    }
  }

  private async loadDataGenerateCharts(
    selectedDate = this.monthPickerService.selectedDate
  ) {
    try {
      this.productCategories =
        await this.microserviceConfigurationService.getCategories(
          Api.Product,
          false
        );
      this.monthlyMicroserviceProdCategoryMap =
        await this.microserviceStatisticsService.getMonthlyMicroserviceProdCategoryMap(
          selectedDate
        );
      this.chartData = this.getChartData(
        this.productCategories,
        this.monthlyMicroserviceProdCategoryMap
      );

      this.productCategories.forEach(elem => {
        this.thresholds[elem.productCategory] = {
          cpuThreshold: elem.cpuThreshold,
          memoryThreshold: elem.memoryThreshold
        }
      });

      if (this.viewCategory === this.VIEW_CATEGORY.MEMORY_CPU) {
        this.generateCpuMemoryChart();
      } else if (this.viewCategory === this.VIEW_CATEGORY.COUNT) {
        this.generateCountChart();
      }
    }
    catch (error) {
      this.commonService.microserviceUnavailableAlert(error)
    }
    finally {
      this.showAlert = !this.chartData
    }
  }

  private generateCpuMemoryChart() {
    const chartContainer = d3.select(".chart-area-category");
    chartContainer.selectAll("svg").remove();
    const parentContainerDimensions = d3
      .select(".card-block")
      .node()
      .getBoundingClientRect();
    const chartContainerDimensions = chartContainer
      .node()
      .getBoundingClientRect();

    let baseWidth;
    let baseHeight;

    if (chartContainerDimensions.width < 600) {
      baseHeight = chartContainerDimensions.width;
      baseWidth = chartContainerDimensions.width;
    } else {
      baseWidth = chartContainerDimensions.width - 48;
      baseHeight = parentContainerDimensions.height - 32.108;
    }

    const MARGIN = { TOP: 10, RIGHT: 10, BOTTOM: 32.108, LEFT: 97.081 },
      width = baseWidth - MARGIN.LEFT - MARGIN.RIGHT,
      height = baseHeight - MARGIN.TOP - MARGIN.BOTTOM;

    const svgWidth = width + MARGIN.LEFT + MARGIN.RIGHT;
    const svgHeight = height + MARGIN.TOP + MARGIN.BOTTOM;

    const svg = chartContainer
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const chartContainerUnit = svg
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.LEFT}, ${3 * MARGIN.TOP + MARGIN.BOTTOM})`
      );

    chartContainerUnit
      .append("text")
      .text(`🖥 ${COLUMN_FIELDS.CPU_AVG}`)
      .attr("text-anchor", "start")
      .attr(
        "transform",
        `translate(${svgWidth - MARGIN.LEFT - MARGIN.RIGHT}, ${svgHeight / 2
        }) rotate(-90)`
      )
      .attr("font-weight", "bold");

    chartContainerUnit
      .append("text")
      .text(`💾 ${COLUMN_FIELDS.MEMORY_AVG}`)
      .attr("text-anchor", "start")
      .attr(
        "transform",
        `translate(${(-MARGIN.LEFT * 3) / 4}, ${svgHeight / 2}) rotate(-90)`
      )
      .attr("font-weight", "bold");

    const legend = chartContainerUnit.append("g").attr("class", "legend");

    legend.attr("transform", `translate(${svgWidth / 4}, -40.038)`);

    const memoryLegend = legend.append("g");
    const cpuLegend = legend.append("g");

    memoryLegend.on("mouseover", () => {
      d3.selectAll(".cpu-bar").attr("fill-opacity", "0.1");
      d3.selectAll(".cpu-text").attr("fill-opacity", "0.1");
      d3.selectAll(".cpu-threshold").attr("fill-opacity", "0.1");
    });
    memoryLegend.on("mouseout", () => {
      d3.selectAll(".cpu-bar").attr("fill-opacity", "1");
      d3.selectAll(".cpu-text").attr("fill-opacity", "1");
      d3.selectAll(".cpu-threshold").attr("fill-opacity", "0.3");
    });

    cpuLegend.on("mouseover", () => {
      d3.selectAll(".memory-bar").attr("fill-opacity", "0.1");
      d3.selectAll(".memory-text").attr("fill-opacity", "0.1");
      d3.selectAll(".memory-threshold").attr("fill-opacity", "0.1");
    });
    cpuLegend.on("mouseout", () => {
      d3.selectAll(".memory-bar").attr("fill-opacity", "1");
      d3.selectAll(".memory-text").attr("fill-opacity", "1");
      d3.selectAll(".memory-threshold").attr("fill-opacity", "0.3");
    });

    cpuLegend
      .append("circle")
      .attr("r", 8.204)
      .attr("fill", "#024B7A")
      .style("transform", `translate(-4px, -4px)`);

    cpuLegend.append("text").attr("x", 12).text(`🖥 ${COLUMN_FIELDS.CPU_AVG}`);

    memoryLegend
      .append("circle")
      .attr("r", 8.204)
      .attr("fill", "#44A5C2")
      .style("transform", `translate(-4px, -4px)`);

    memoryLegend.append("text").attr("x", 12.018).text(`💾 ${COLUMN_FIELDS.MEMORY_AVG}`);

    cpuLegend.style("transform", `translate(242px, 0)`);

    if (chartContainerDimensions.width < 600) {
      memoryLegend.style("transform", `translate(0, -8px)`);
      cpuLegend.style("transform", `translate(0, 0)`);
    }

    const xScale = d3
      .scaleBand()
      .domain(Object.keys(this.chartData))
      .range([0, svgWidth - 200]);
    xScale.paddingInner(0.5);
    xScale.paddingOuter(0.1);
    const xAxisGen = d3.axisBottom(xScale);
    const xAxis = chartContainerUnit
      .append("g")
      .classed("x-axis", true)
      .call(xAxisGen)
      .attr("transform", `translate(0,${svgHeight - 150})`);

    const mapCpuMemory = [];

    for (const productCategory in this.chartData) {
      mapCpuMemory.push({
        productCategory: productCategory,
        totalMemory: this.chartData[productCategory].reduce(
          (total, elem) => total + Number(elem.avgMemory),
          0
        ),
        totalCpu: this.chartData[productCategory].reduce(
          (total, elem) => total + Number(elem.avgCpu),
          0
        ),
      });
    }

    const maxMemory =
      d3.max([d3.max(mapCpuMemory.map((elem) => elem.totalMemory)), d3.max(Object.values(this.thresholds).map(elem => elem.memoryThreshold))]) * 1.1;
    const maxCpu = d3.max([d3.max(mapCpuMemory.map((elem) => elem.totalCpu)), d3.max(Object.values(this.thresholds).map(elem => elem.cpuThreshold))]) * 1.1;

    const yScaleMemory = d3
      .scaleLinear()
      .domain([0, maxMemory])
      .range([0, svgHeight - MARGIN.TOP - MARGIN.BOTTOM - 100]);
    const yAxisScaleMemoryGen = d3
      .scaleLinear()
      .domain([0, maxMemory])
      .range([svgHeight - MARGIN.TOP - MARGIN.BOTTOM - 100, 0]);
    const yAxisGenMemory = d3.axisLeft(yAxisScaleMemoryGen).ticks(5);
    chartContainerUnit
      .append("g")
      .classed("y-axis-memory", true)
      .call(yAxisGenMemory);

    const yScaleCpu = d3
      .scaleLinear()
      .domain([0, maxCpu])
      .range([0, svgHeight - MARGIN.TOP - MARGIN.BOTTOM - 100]);
    const yAxisScaleCpuGen = d3
      .scaleLinear()
      .domain([0, maxCpu])
      .range([svgHeight - MARGIN.TOP - MARGIN.BOTTOM - 100, 0]);
    const yAxisGenCpu = d3.axisRight(yAxisScaleCpuGen).ticks(5);
    chartContainerUnit
      .append("g")
      .classed("y-axis-cpu", true)
      .call(yAxisGenCpu);
    d3.select(".y-axis-cpu").attr(
      "transform",
      `translate(${svgWidth - MARGIN.LEFT - 100}, 0)`
    );

    const chartRect = chartContainerUnit.append("g").classed("progress", true);
    const progressContainer = chartContainerUnit
      .select(".progress")
      .selectAll("g")
      .data(mapCpuMemory)
      .join("g")
      .classed("progress-container", true);

    const cpuBar = progressContainer.append("g");
    const memoryBar = progressContainer.append("g");


    cpuBar
      .append("rect")
      .attr("x", (d) => xScale(d.productCategory))
      .attr("width", (d) => xScale.bandwidth() / 2 - 2.198)
      .attr("height", (d) => yScaleCpu(this.thresholds[d.productCategory].cpuThreshold))
      .attr(
        "transform",
        (d) => `translate(0, ${svgHeight - yScaleCpu(this.thresholds[d.productCategory].cpuThreshold) - 150})`
      )
      .attr("fill", "#024B7A")
      .attr("opacity", "0.2")
      .classed("cpu-threshold", true);

    cpuBar
      .append("rect")
      .attr("x", (d) => xScale(d.productCategory))
      .attr("width", (d) => xScale.bandwidth() / 2 - 2.198)
      .attr("height", (d) => yScaleCpu(d.totalCpu))
      .attr(
        "transform",
        (d) => `translate(0, ${svgHeight - yScaleCpu(d.totalCpu) - 150})`
      )
      .attr("fill", "#024B7A")
      .classed("cpu-bar", true);

    memoryBar
      .append("rect")
      .attr("x", (d) => xScale(d.productCategory) + xScale.bandwidth() / 2 + 2.198)
      .attr("width", (d) => xScale.bandwidth() / 2 - 2.198)
      .attr("height", (d) => yScaleMemory(this.thresholds[d.productCategory].memoryThreshold))
      .attr(
        "transform",
        (d) => `translate(0, ${svgHeight - yScaleMemory(this.thresholds[d.productCategory].memoryThreshold) - 150})`
      )
      .attr("fill", "#44A5C2")
      .attr("opacity", "0.2")
      .classed("memory-threshold", true);

    memoryBar
      .append("rect")
      .attr("x", (d) => xScale(d.productCategory) + xScale.bandwidth() / 2 + 2.198)
      .attr("width", (d) => xScale.bandwidth() / 2 - 2.198)
      .attr("height", (d) => yScaleMemory(d.totalMemory))
      .attr(
        "transform",
        (d) => `translate(0, ${svgHeight - yScaleMemory(d.totalMemory) - 150})`
      )
      .attr("fill", "#44A5C2")
      .classed("memory-bar", true);

    cpuBar
      .append("text")
      .attr("x", (d) => xScale(d.productCategory) + xScale.bandwidth() / 2)
      .attr("transform", (d) => {
        const maxHeight = d3.max([
          yScaleCpu(d.totalCpu),
          yScaleCpu(this.thresholds[d.productCategory].cpuThreshold),
          yScaleMemory(d.totalMemory),
          yScaleMemory(this.thresholds[d.productCategory].memoryThreshold),
        ]);
        return `translate(0, ${svgHeight - maxHeight - 180})`;
      })
      .style("text-anchor", "middle")
      .text((d) => `🖥 ${d.totalCpu.toFixed(2)} ${d.totalCpu > this.thresholds[d.productCategory].cpuThreshold ? '⚠️' : ''}`)
      .classed("cpu-text", true)
      .append('title')
      .text((d) => `🖥 ${d.totalCpu.toFixed(2)} CPUs, Threshold is ${this.thresholds[d.productCategory].cpuThreshold} CPUs`);

    memoryBar
      .append("text")
      .attr("x", (d) => xScale(d.productCategory) + xScale.bandwidth() / 2)
      .attr("transform", (d) => {
        const maxHeight = d3.max([
          yScaleCpu(d.totalCpu),
          yScaleCpu(this.thresholds[d.productCategory].cpuThreshold),
          yScaleMemory(d.totalMemory),
          yScaleMemory(this.thresholds[d.productCategory].memoryThreshold),
        ]);
        return `translate(0, ${svgHeight - maxHeight - 160})`;
      })
      .style("text-anchor", "middle")
      .text((d) => `💾 ${d.totalMemory.toFixed(2)} ${d.totalMemory > this.thresholds[d.productCategory].memoryThreshold ? '⚠️' : ''}`)
      .classed("memory-text", true)
      .append('title')
      .text((d) => `🖥 ${d.totalMemory.toFixed(2)} GiB, Threshold is ${this.thresholds[d.productCategory].memoryThreshold} GiB`);;

    if (chartContainerDimensions.width < 600) {
      d3.selectAll(".x-axis .tick text")
        .attr("text-anchor", "end")
        .style("transform", "rotate(-45deg)");

      d3.selectAll(".progress-container g text").attr("font-size", "80%");
      d3.selectAll(".legend").attr("transform", `translate(0,-40.038)`)
      d3.selectAll(".legend text").attr("font-size", "80%")
        .attr("transform", `translate(0,0)`)
      d3.selectAll(".legend g circle").attr('r', 4.204)
      d3.selectAll(".legend g text").attr('x', 6)
      memoryLegend.style("transform", `translate(0px, 12px)`);
    }
  }

  private generateCountChart() {
    const chartContainer = d3.select(".chart-area-category");
    chartContainer.selectAll("svg").remove();
    const parentContainerDimensions = d3
      .select(".card-block")
      .node()
      .getBoundingClientRect();
    const chartContainerDimensions = chartContainer
      .node()
      .getBoundingClientRect();

    let baseWidth;
    let baseHeight;

    if (chartContainerDimensions.width < 600) {
      baseHeight = chartContainerDimensions.width;
      baseWidth = chartContainerDimensions.width;
    } else {
      baseWidth = chartContainerDimensions.width - 48;
      baseHeight = parentContainerDimensions.height - 32.108;
    }

    const MARGIN = { TOP: 10, RIGHT: 10, BOTTOM: 32.108, LEFT: 97.08 },
      width = baseWidth - MARGIN.LEFT - MARGIN.RIGHT,
      height = baseHeight - MARGIN.TOP - MARGIN.BOTTOM;

    const svgWidth = width + MARGIN.LEFT + MARGIN.RIGHT;
    const svgHeight = height + MARGIN.TOP + MARGIN.BOTTOM;

    const svg = chartContainer
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    const chartContainerUnit = svg
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.LEFT}, ${3 * MARGIN.TOP + MARGIN.BOTTOM})`
      );

    const xScale = d3
      .scaleBand()
      .domain(Object.keys(this.chartData))
      .range([0, svgWidth - 100]);
    xScale.paddingInner(0.5);
    xScale.paddingOuter(0.1);
    const xAxisGen = d3.axisBottom(xScale);
    const xAxis = chartContainerUnit
      .append("g")
      .classed("x-axis", true)
      .call(xAxisGen)
      .attr("transform", `translate(0,${svgHeight - 150})`);

    const values: any = Object.values(this.chartData);
    const yMaxValue = d3.max(values.map((d) => d.length)) * 1.1;
    const yScale = d3
      .scaleLinear()
      .domain([0, yMaxValue])
      .range([0, svgHeight - MARGIN.TOP - MARGIN.BOTTOM - 100]);
    const yAxisScaleGen = d3
      .scaleLinear()
      .domain([0, yMaxValue])
      .range([svgHeight - MARGIN.TOP - MARGIN.BOTTOM - 100, 0]);
    const yAxisGen = d3.axisLeft(yAxisScaleGen).ticks(5);
    const yAxis = chartContainerUnit
      .append("g")
      .classed("y-axis", true)
      .call(yAxisGen);

    const countMap = [];

    for (const productCategory in this.chartData) {
      countMap.push({
        productCategory: productCategory,
        count: this.chartData[productCategory].length,
      });
    }
    const chartRect = chartContainerUnit.append("g").classed("progress", true);
    const progressContainer = chartContainerUnit
      .select(".progress")
      .selectAll("g")
      .data(countMap)
      .join("g")
      .classed("progress-container", true);

    progressContainer
      .append("rect")
      .attr("x", (d) => xScale(d.productCategory))
      .attr("width", (d) => xScale.bandwidth())
      .attr("height", (d) => yScale(d.count))
      .attr(
        "transform",
        (d) => `translate(0, ${svgHeight - yScale(d.count) - 150})`
      )
      .attr("fill", (d, i) => CLASS_COLORS[i]);

    progressContainer
      .append("text")
      .attr("x", (d) => xScale(d.productCategory) + xScale.bandwidth() / 2)
      .attr(
        "transform",
        (d) => `translate(0, ${svgHeight - yScale(d.count) - 160})`
      )
      .style("text-anchor", "middle")
      .text((d) => d.count);

    if (chartContainerDimensions.width < 600) {
      d3.selectAll(".x-axis .tick text")
        .attr("text-anchor", "end")
        .style("transform", "rotate(-45deg)");

      d3.selectAll(".progress-container g text").attr("font-size", "80%");
    }
  }

  private getChartData(
    productCategories: ProductCategory[],
    monthlyMicroserviceProdCategoryMap: MonthlyMicroserviceProdCategoryMap[]
  ) {
    const chartData = {};
    productCategories.forEach((elem) => {
      chartData[elem.productCategory] = [];
    });
    monthlyMicroserviceProdCategoryMap.forEach(
      (elem: MonthlyMicroserviceProdCategoryMap) => {
        chartData[elem.productCategory].push(elem);
      }
    );
    return chartData;
  }

  changeUnit(unit: string) {
    try {
      this.viewCategory = unit;
      if (this.viewCategory === this.VIEW_CATEGORY.MEMORY_CPU) {
        this.generateCpuMemoryChart();
      } else if (this.viewCategory === this.VIEW_CATEGORY.COUNT) {
        this.generateCountChart();
      }
    } catch (err) {
      console.log(gettext("Error in chart generation"));
      console.error(err.message);
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

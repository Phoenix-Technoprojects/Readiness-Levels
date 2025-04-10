import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { createTooltip } from "./utils.js";

const tooltip = createTooltip();

const data = [
  {
    id: "TRL",
    name: "Technology Readiness Level",
    description: "Indicates the maturity of a particular technology.",
    levels: [
      "Basic principles observed",
      "Technology concept formulated",
      "Experimental proof of concept",
      "Technology validated in lab",
      "Technology validated in relevant environment",
      "Technology demonstrated in relevant environment",
      "System prototype demonstration in operational environment",
      "System complete and qualified",
      "Actual system proven in operational environment"
    ]
  },
  {
    id: "MRL",
    name: "Manufacturing Readiness Level",
    description: "Assesses the maturity of manufacturing capabilities.",
    levels: [
      "Basic manufacturing implications identified",
      "Manufacturing concepts identified",
      "Manufacturing proof of concept demonstrated",
      "Capability to produce the technology in a lab",
      "Capability to produce in relevant environment",
      "Capability to produce prototype in pilot environment",
      "Capability to produce at low rate initial production",
      "Capability in place for limited production",
      "Manufacturing processes stable, capable, and in control"
    ]
  },
  {
    id: "SRL",
    name: "System Readiness Level",
    description: "Evaluates the integration and readiness of system components.",
    levels: [
      "System concept identified",
      "Subsystem relationships defined",
      "Basic integration concept developed",
      "Interfaces defined and validated",
      "Subsystems tested in lab",
      "Subsystems tested in relevant environment",
      "System prototype validated",
      "System validated in real-world environment",
      "System operationally ready"
    ]
  },
  {
    id: "PRL",
    name: "People Readiness Level",
    description: "Measures workforce alignment, capability, and readiness.",
    levels: [
      "Skills gap identified",
      "Initial training strategy developed",
      "Awareness and buy-in achieved",
      "Basic training completed",
      "Key teams formed",
      "Workforce engaged",
      "Workforce capable",
      "Leadership and teams aligned",
      "Fully staffed and operational"
    ]
  },
  {
    id: "MRKL",
    name: "Market Readiness Level",
    description: "Indicates how ready the market is for the offering.",
    levels: [
      "Market need hypothesized",
      "Target audience identified",
      "Preliminary demand signals",
      "Market analysis completed",
      "Market segmentation verified",
      "Initial customer engagement",
      "Early adopters onboarded",
      "Established market presence",
      "Strong competitive positioning"
    ]
  },
  {
    id: "ORL",
    name: "Operations Readiness Level",
    description: "Evaluates operational preparedness to scale and support the system.",
    levels: [
      "Ops framework conceptualized",
      "Operational requirements defined",
      "Core team identified",
      "Initial process flow outlined",
      "Tooling and resources scoped",
      "Standard Operating Procedures in place",
      "Initial operations trials",
      "Operational continuity ensured",
      "Fully functioning operations"
    ]
  },
  {
    id: "CRL",
    name: "Customer Readiness Level",
    description: "Assesses customer maturity, engagement, and adoption.",
    levels: [
      "Customer needs observed",
      "Early feedback loop initiated",
      "Personas created",
      "First customer contact",
      "Alpha/beta testing in place",
      "Customer onboarding",
      "User engagement metrics validated",
      "Customer success strategy applied",
      "Customer base matured"
    ]
  },
  {
    id: "FRL",
    name: "Financial Readiness Level",
    description: "Assesses financial robustness, sustainability, and investment readiness.",
    levels: [
      "Cost structure identified",
      "Funding source explored",
      "Basic budget defined",
      "Financial plan drafted",
      "Break-even analysis completed",
      "Initial funding secured",
      "Revenue strategy validated",
      "Financial KPIs tracking",
      "Sustainable growth achieved"
    ]
  }
];

const margin = { top: 20, right: 20, bottom: 20, left: 20 },
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3
  .select("#readiness-arrows")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear().domain([0, 9]).range([0, width]);
const y = d3
  .scaleBand()
  .domain(data.map((d) => d.id))
  .range([0, height])
  .padding(0.2);

// Grid lines
const xAxisGrid = d3.axisBottom(x).ticks(9).tickSize(-height).tickFormat(d3.format("d"));
svg.append("g")
  .attr("class", "x grid")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxisGrid);

svg.append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(y))
  .selectAll(".tick")
  .data(data)
  .append("title")
  .text((d) => `${d.name}: ${d.description}`);

// Bars and Arrows
const barHeight = y.bandwidth() * 0.6;

const bars = svg
  .selectAll(".bar-group")
  .data(data)
  .enter()
  .append("g")
  .attr("class", "bar-group")
  .attr("transform", (d) => `translate(0, ${y(d.id) + y.bandwidth() / 2 - barHeight / 2})`);

bars
  .append("rect")
  .attr("x", x(0))
  .attr("width", 0)
  .attr("height", barHeight/4)
  .attr("fill", "url(#gradient-bar)")
  .transition()
  .duration(2000)
  .attr("width", x(9) - x(0))
  .transition()
  .duration(1000)
  .attr("height", barHeight)
  .on("end", function (_, i, nodes) {
    const group = d3.select(nodes[i].parentNode);
    const tipX = x(9.5);
    const baseY = barHeight / 2;
    group
      .append("polygon")
      .attr("points", `${tipX},${baseY} ${x(9)},0 ${x(9)},${barHeight}`)
      .attr("fill", "green")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1)
      
  });

// Level hover indicators
bars.each(function (d, i) {
  d.levels.forEach((level, index) => {
    d3.select(this)
      .append("circle")
      .attr("cx", x(index + 0.5))
      .attr("cy", barHeight / 2)
      .attr("r", 5)
      .attr("fill", "white")
      .on("mouseover", (event) => tooltip.show(level, event.pageX, event.pageY))
      .on("mousemove", (event) => tooltip.show(level, event.pageX, event.pageY))
      .on("mouseout", tooltip.hide);
  });
});

// Define gradient
const defs = svg.append("defs");
const gradient = defs
  .append("linearGradient")
  .attr("id", "gradient-bar")
  .attr("x1", "0%")
  .attr("x2", "100%")
  .attr("y1", "0%")
  .attr("y2", "0%");

gradient
  .append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "red");

gradient
  .append("stop")
  .attr("offset", "50%")
  .attr("stop-color", "yellow");

gradient
  .append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "green");
